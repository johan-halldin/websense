import { createServer } from "node:http";
import { query } from "@websense/db";
import { clamp } from "@websense/util";

const PORT = clamp(Number(process.env.PORT) || 3001, 0, 65535);
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * @param {URL} url
 * @param {import("node:http").ServerResponse} res
 */
async function handleMeasurements(url, res) {
  const now = Date.now();
  const from = new Date(url.searchParams.get("from") ?? now - DAY_MS);
  const to = new Date(url.searchParams.get("to") ?? now);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid from/to timestamp" }));
    return;
  }

  const { rows } = await query(
    `SELECT
       time,
       probe_id AS "probeId",
       rtt_avg_ms AS "rttAvgMs",
       rtt_min_ms AS "rttMinMs",
       rtt_max_ms AS "rttMaxMs",
       packet_loss_pct AS "packetLossPct"
     FROM ping_results
     WHERE time >= $1 AND time <= $2
     ORDER BY time ASC`,
    [from, to],
  );

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(rows));
}

/**
 * @param {import("node:http").ServerResponse} res
 */
async function handleMesh(res) {
  const { rows } = await query(
    `SELECT DISTINCT ON (p.probe_id, p.measurement_id)
       src.name AS "srcName",
       dst.name AS "dstName",
       p.time,
       p.rtt_avg_ms AS "rttAvgMs",
       p.packet_loss_pct AS "packetLossPct"
     FROM ping_results p
     JOIN cities src ON src.probe_id = p.probe_id
     JOIN cities dst ON dst.measurement_id = p.measurement_id
     ORDER BY p.probe_id, p.measurement_id, p.time DESC`,
  );

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(rows));
}

/**
 * @param {import("node:http").IncomingMessage} req
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
 * @param {import("node:http").ServerResponse} res
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
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
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
 * @param {import("node:http").ServerResponse} res
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

  if (url.pathname === "/api/measurements") {
    handleMeasurements(url, res).catch(onError);
    return;
  }

  if (url.pathname === "/api/mesh") {
    handleMesh(res).catch(onError);
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
