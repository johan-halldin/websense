import { query } from "@websense/db";
import { normalizeResults } from "./normalize.js";
import { fetchResults } from "./ripe-atlas.js";

/**
 * @typedef {object} ICity
 * @property {number} id
 * @property {string} name
 * @property {number} probeId
 * @property {number} measurementId
 */

const { rows: cities } = /** @type {{rows: ICity[]}} */ (
  await query(
    `SELECT id, name, probe_id AS "probeId", measurement_id AS "measurementId" FROM cities`,
  )
);

if (cities.length < 2) {
  console.log("Fewer than 2 cities configured, nothing to ingest.");
  process.exit(0);
}

let totalRows = 0;

for (const target of cities) {
  const sourceProbeIds = cities
    .filter((city) => city.id !== target.id)
    .map((city) => city.probeId);

  const rawResults = await fetchResults(target.measurementId, sourceProbeIds);
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

  console.log(`${target.name}: ingested ${rows.length} ping result(s).`);
  totalRows += rows.length;
}

console.log(`Done. Ingested ${totalRows} ping result(s) total.`);
process.exit(0);
