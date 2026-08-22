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

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

  if (url.pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (url.pathname === "/api/measurements") {
    handleMeasurements(url, res).catch((error) => {
      console.error(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
