import { createServer } from "node:http";
import {
  listenForPingResultsUpdates,
  query,
  runIngestCycle,
} from "@websense/db";
import { clamp } from "@websense/util";

/** @import { IncomingMessage, ServerResponse } from "node:http" */

const PORT = clamp(Number(process.env.PORT) || 3001, 0, 65535);

/** @type {Set<ServerResponse>} */
const sseClients = new Set();

/**
 * @param {ServerResponse} res
 */
function handleEvents(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("\n");
  sseClients.add(res);
  res.on("close", () => sseClients.delete(res));
}

/** An ingest cycle inserts in many batches, each firing its own NOTIFY -
 * coalesce a burst of them into a single broadcast once things go quiet. */
const NOTIFY_DEBOUNCE_MS = 500;
/** @type {NodeJS.Timeout|null} */
let broadcastTimer = null;

listenForPingResultsUpdates(() => {
  if (broadcastTimer !== null) {
    clearTimeout(broadcastTimer);
  }
  broadcastTimer = setTimeout(() => {
    broadcastTimer = null;
    for (const res of sseClients) {
      res.write("data: mesh-updated\n\n");
    }
  }, NOTIFY_DEBOUNCE_MS);
});

/**
 * @param {ServerResponse} res
 */
async function handleMesh(res) {
  const { rows } = await query(
    `WITH latest AS (
       SELECT DISTINCT ON (probe_id, measurement_id)
         probe_id, measurement_id, time, rtt_avg_ms, packet_loss_pct
       FROM ping_results
       ORDER BY probe_id, measurement_id, time DESC
     ),
     stats AS (
       SELECT
         probe_id,
         measurement_id,
         avg(rtt_avg_ms) AS avg_rtt_ms,
         avg(packet_loss_pct) AS avg_packet_loss_pct
       FROM ping_results
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

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(rows));
}

/**
 * @param {ServerResponse} res
 */
async function handleIngest(res) {
  const totalRows = await runIngestCycle();

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ totalRows }));
}

/**
 * @param {URLSearchParams} searchParams
 * @param {ServerResponse} res
 */
async function handleCityPair(searchParams, res) {
  const srcId = Number(searchParams.get("src"));
  const dstId = Number(searchParams.get("dst"));

  if (!Number.isInteger(srcId) || !Number.isInteger(dstId)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Expected ?src=<cityId>&dst=<cityId>" }));
    return;
  }

  const { rows } = await query(
    `SELECT
       ping_results.time,
       ping_results.rtt_avg_ms AS "rttMs",
       ping_results.packet_loss_pct AS "packetLossPct"
     FROM ping_results
     JOIN cities src ON src.probe_id = ping_results.probe_id AND src.id = $1
     JOIN cities dst
       ON dst.measurement_id = ping_results.measurement_id AND dst.id = $2
     ORDER BY ping_results.time DESC
     LIMIT 100`,
    [srcId, dstId],
  );

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(rows));
}

/**
 * @param {IncomingMessage} req
 * @returns {Promise<unknown>}
 */
async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
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

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(rows));
}

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
async function handleCreateCity(req, res) {
  const body = /** @type {Record<string, unknown>} */ (await readJsonBody(req));
  const name = body.name;
  const country = body.country;
  const lat = Number(body.lat);
  const lon = Number(body.lon);
  const probeId = Number(body.probeId);
  const measurementId = Number(body.measurementId);

  if (
    typeof name !== "string" ||
    typeof country !== "string" ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    !Number.isInteger(probeId) ||
    !Number.isInteger(measurementId)
  ) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error:
          "Expected { name: string, country: string, lat: number, lon: number, probeId: integer, measurementId: integer }",
      }),
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
    [name, country, lat, lon, probeId, measurementId],
  );

  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify(rows[0]));
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
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  };

  if (url.pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
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
    handleDeleteCity(Number(cityIdMatch[1]), res).catch(onError);
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
