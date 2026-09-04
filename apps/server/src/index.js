import { createServer } from "node:http";
import {
  isApiCityPairGrouping,
  isApiCityPairRange,
  isApiCorrelationGrouping,
  isApiCorrelationRange,
  isApiCreateCity,
} from "@websense/api-types";
import { query, runIngestCycle } from "@websense/db";
import { clamp, isPositiveInteger } from "@websense/util";
import { handleEvents } from "./events.js";
import { readJsonBody, sendError, sendJson } from "./http.js";

/** @import { IncomingMessage, ServerResponse } from "node:http" */

const PORT = clamp(Number(process.env.PORT) || 3001, 0, 65535);

/**
 * @param {ServerResponse} res
 */
async function handleMesh(res) {
  const { rows } = await query(
    `WITH results AS (
       -- Some RIPE Atlas results report a fully lossy ping as rtt_avg_ms
       -- = -1 rather than omitting it (normalize.js guards new ingests,
       -- this covers rows already stored before that fix).
       SELECT
         probe_id,
         measurement_id,
         time,
         CASE WHEN rtt_avg_ms < 0 THEN NULL ELSE rtt_avg_ms END AS rtt_avg_ms,
         packet_loss_pct
       FROM ping_results
     ),
     latest AS (
       SELECT DISTINCT ON (probe_id, measurement_id)
         probe_id, measurement_id, time, rtt_avg_ms, packet_loss_pct
       FROM results
       ORDER BY probe_id, measurement_id, time DESC
     ),
     stats AS (
       SELECT
         probe_id,
         measurement_id,
         avg(rtt_avg_ms) AS avg_rtt_ms,
         avg(packet_loss_pct) AS avg_packet_loss_pct
       FROM results
       GROUP BY probe_id, measurement_id
     )
     SELECT
       src.name AS "srcName",
       src.lat AS "srcLat",
       src.lon AS "srcLon",
       dst.name AS "dstName",
       dst.lat AS "dstLat",
       dst.lon AS "dstLon",
       latest.time,
       latest.rtt_avg_ms AS "rttAvgMs",
       latest.packet_loss_pct AS "packetLossPct",
       stats.avg_rtt_ms AS "avgRttMs",
       stats.avg_packet_loss_pct AS "avgPacketLossPct"
     FROM latest
     JOIN stats
       ON stats.probe_id = latest.probe_id
       AND stats.measurement_id = latest.measurement_id
     JOIN cities src ON src.probe_id = latest.probe_id
     JOIN cities dst ON dst.measurement_id = latest.measurement_id
     ORDER BY src.name, dst.name`,
  );

  sendJson(res, 200, rows);
}

/**
 * @param {ServerResponse} res
 */
async function handleIngest(res) {
  const totalRows = await runIngestCycle();

  sendJson(res, 200, { totalRows });
}

/**
 * @param {URLSearchParams} searchParams
 * @param {ServerResponse} res
 */
async function handleCityPair(searchParams, res) {
  const srcId = Number(searchParams.get("src"));
  const dstId = Number(searchParams.get("dst"));
  const range = searchParams.get("range") ?? "day";
  const grouping = searchParams.get("group") ?? "none";

  if (
    !isPositiveInteger(srcId) ||
    !isPositiveInteger(dstId) ||
    !isApiCityPairRange(range) ||
    !isApiCityPairGrouping(grouping)
  ) {
    sendError(
      res,
      400,
      "Expected ?src=<cityId>&dst=<cityId>&range=day|week|month|year&group=none|hour|day",
    );
    return;
  }
  const rangeInterval =
    range === "day"
      ? "1 day"
      : range === "week"
        ? "1 week"
        : range === "month"
          ? "1 month"
          : "1 year";
  const groupingInterval =
    grouping === "none" ? null : grouping === "hour" ? "1 hour" : "1 day";

  const baseQuery = `FROM ping_results
     JOIN cities src ON src.probe_id = ping_results.probe_id AND src.id = $1
     JOIN cities dst
       ON dst.measurement_id = ping_results.measurement_id AND dst.id = $2
     WHERE ping_results.time >= NOW() - $3::interval`;
  const selectRtt = `CASE
       WHEN ping_results.rtt_avg_ms < 0 THEN NULL
       ELSE ping_results.rtt_avg_ms
     END`;
  const result =
    groupingInterval === null
      ? await query(
          `SELECT
       ping_results.time,
       ${selectRtt} AS "rttMs",
       ping_results.packet_loss_pct AS "packetLossPct"
     ${baseQuery}
     ORDER BY ping_results.time DESC`,
          [srcId, dstId, rangeInterval],
        )
      : await query(
          `SELECT
             time_bucket($4::interval, ping_results.time) AS time,
             avg(${selectRtt}) AS "rttMs",
             avg(ping_results.packet_loss_pct) AS "packetLossPct"
           ${baseQuery}
           GROUP BY 1
           ORDER BY time DESC`,
          [srcId, dstId, rangeInterval, groupingInterval],
        );

  sendJson(res, 200, result.rows);
}

/**
 * @param {URLSearchParams} searchParams
 * @param {ServerResponse} res
 */
async function handleCorrelations(searchParams, res) {
  const range = searchParams.get("range") ?? "week";
  const grouping = searchParams.get("group") ?? "hour";

  if (!isApiCorrelationRange(range) || !isApiCorrelationGrouping(grouping)) {
    sendError(res, 400, "Expected ?range=week|month|year&group=hour|day");
    return;
  }
  const rangeInterval =
    range === "week" ? "1 week" : range === "month" ? "1 month" : "1 year";
  const groupingInterval = grouping === "hour" ? "1 hour" : "1 day";

  const minSharedBuckets = groupingInterval === "1 hour" ? 24 : 7;
  const { rows } = await query(
    `WITH bucketed AS MATERIALIZED (
       SELECT
         src.id AS src_id,
         dst.id AS dst_id,
         time_bucket($2::interval, ping_results.time) AS bucket,
         avg(
           CASE
             WHEN ping_results.rtt_avg_ms < 0 THEN NULL
             ELSE ping_results.rtt_avg_ms
           END
         ) AS value
       FROM ping_results
       JOIN cities src ON src.probe_id = ping_results.probe_id
       JOIN cities dst ON dst.measurement_id = ping_results.measurement_id
       WHERE ping_results.time >= NOW() - $1::interval
       GROUP BY 1, 2, 3
     ),
     correlations AS (
       SELECT
         first_route.src_id AS first_src_id,
         first_route.dst_id AS first_dst_id,
         second_route.src_id AS second_src_id,
         second_route.dst_id AS second_dst_id,
         corr(first_route.value, second_route.value) AS correlation,
         count(*) AS shared_buckets
       FROM bucketed first_route
       JOIN bucketed second_route
         ON second_route.bucket = first_route.bucket
         AND (second_route.src_id, second_route.dst_id) >
           (first_route.src_id, first_route.dst_id)
       WHERE first_route.value IS NOT NULL AND second_route.value IS NOT NULL
       GROUP BY 1, 2, 3, 4
       HAVING count(*) >= $3
     )
     SELECT
       first_src.name AS "firstSrcName",
       first_dst.name AS "firstDstName",
       second_src.name AS "secondSrcName",
       second_dst.name AS "secondDstName",
       correlations.correlation,
       correlations.shared_buckets AS "sharedBuckets",
       (
         correlations.first_src_id = correlations.second_dst_id
         AND correlations.first_dst_id = correlations.second_src_id
       ) AS "isSymmetric"
     FROM correlations
     JOIN cities first_src ON first_src.id = correlations.first_src_id
     JOIN cities first_dst ON first_dst.id = correlations.first_dst_id
     JOIN cities second_src ON second_src.id = correlations.second_src_id
     JOIN cities second_dst ON second_dst.id = correlations.second_dst_id
     WHERE correlations.correlation IS NOT NULL
     ORDER BY abs(correlations.correlation) DESC
     LIMIT 100`,
    [rangeInterval, groupingInterval, minSharedBuckets],
  );

  sendJson(res, 200, rows);
}

/**
 * @param {ServerResponse} res
 */
async function handleListCities(res) {
  const { rows } = await query(
    `SELECT
       id,
       name,
       country,
       lat,
       lon,
       probe_id AS "probeId",
       measurement_id AS "measurementId"
     FROM cities
     ORDER BY name ASC`,
  );

  sendJson(res, 200, rows);
}

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
async function handleCreateCity(req, res) {
  let city;
  try {
    city = await readJsonBody(req);
  } catch {
    sendError(res, 400, "Expected a valid JSON request body");
    return;
  }

  if (!isApiCreateCity(city)) {
    sendError(
      res,
      400,
      "Expected { name: string, country: string, lat: number, lon: number, probeId: integer, measurementId: integer }",
    );
    return;
  }

  const { rows } = await query(
    `INSERT INTO cities (name, country, lat, lon, probe_id, measurement_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING
       id,
       name,
       country,
       lat,
       lon,
       probe_id AS "probeId",
       measurement_id AS "measurementId"`,
    [
      city.name,
      city.country,
      city.lat,
      city.lon,
      city.probeId,
      city.measurementId,
    ],
  );

  sendJson(res, 201, rows[0]);
}

/**
 * @param {number} id
 * @param {ServerResponse} res
 */
async function handleDeleteCity(id, res) {
  await query("DELETE FROM cities WHERE id = $1", [id]);
  res.writeHead(204);
  res.end();
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

  const onError = (/** @type {unknown} */ error) => {
    console.error(error);
    sendError(res, 500, "Internal server error");
  };

  if (url.pathname === "/api/health") {
    sendJson(res, 200, { status: "ok" });
    return;
  }

  if (url.pathname === "/api/mesh") {
    handleMesh(res).catch(onError);
    return;
  }

  if (url.pathname === "/api/events") {
    handleEvents(res);
    return;
  }

  if (url.pathname === "/api/ingest" && req.method === "POST") {
    handleIngest(res).catch(onError);
    return;
  }

  if (url.pathname === "/api/city-pair" && req.method === "GET") {
    handleCityPair(url.searchParams, res).catch(onError);
    return;
  }

  if (url.pathname === "/api/correlations" && req.method === "GET") {
    handleCorrelations(url.searchParams, res).catch(onError);
    return;
  }

  if (url.pathname === "/api/cities" && req.method === "GET") {
    handleListCities(res).catch(onError);
    return;
  }

  if (url.pathname === "/api/cities" && req.method === "POST") {
    handleCreateCity(req, res).catch(onError);
    return;
  }

  const cityIdMatch = url.pathname.match(/^\/api\/cities\/(\d+)$/);
  if (cityIdMatch && req.method === "DELETE") {
    const cityIdText = cityIdMatch[1];
    if (cityIdText !== undefined) {
      const cityId = Number(cityIdText);
      if (isPositiveInteger(cityId)) {
        handleDeleteCity(cityId, res).catch(onError);
        return;
      }
    }
  }

  sendError(res, 404, "Not found");
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
