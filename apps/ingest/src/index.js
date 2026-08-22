import { query } from "@websense/db";
import { MEASUREMENT_ID, PROBE_IDS } from "./config.js";
import { normalizeResults } from "./normalize.js";
import { fetchResults } from "./ripe-atlas.js";

const rawResults = await fetchResults(MEASUREMENT_ID, PROBE_IDS);
const rows = normalizeResults(rawResults);

for (const row of rows) {
  await query(
    `INSERT INTO ping_results
       (time, probe_id, measurement_id, dst_addr, dst_name, rtt_avg_ms, rtt_min_ms, rtt_max_ms, packet_loss_pct)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT DO NOTHING`,
    [
      row.time,
      row.probeId,
      row.measurementId,
      row.dstAddr,
      row.dstName,
      row.rttAvgMs,
      row.rttMinMs,
      row.rttMaxMs,
      row.packetLossPct,
    ],
  );
}

console.log(`Ingested ${rows.length} ping result(s).`);
process.exit(0);
