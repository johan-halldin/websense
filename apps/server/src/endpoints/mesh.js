import { query } from "@websense/db";
import { sendJson } from "../http.js";

/** @import { ServerResponse } from "node:http" */

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

export { handleMesh };
