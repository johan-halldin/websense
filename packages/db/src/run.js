import { pool } from "./pool.js";
import { normalizeResults } from "./normalize.js";
import { fetchResults } from "./ripe-atlas.js";

/**
 * @typedef {import("./normalize.js").PingRow} PingRow
 */

/**
 * @typedef {object} City
 * @property {number} id
 * @property {string} name
 * @property {number} probeId
 * @property {number} measurementId
 */

const INSERT_COLUMNS = [
  "time",
  "probe_id",
  "measurement_id",
  "dst_addr",
  "dst_name",
  "rtt_avg_ms",
  "rtt_min_ms",
  "rtt_max_ms",
  "packet_loss_pct",
];

/** Rows per INSERT statement. Postgres caps bind parameters at 65535; at
 * 9 columns/row that's ~7281 rows max, so this stays comfortably under
 * that while still cutting a ~4000-row cycle down to a handful of
 * round-trips instead of one per row. */
const INSERT_BATCH_SIZE = 500;

/**
 * @param {PingRow[]} rows
 * @returns {Promise<void>}
 */
async function insertRows(rows) {
  for (let i = 0; i < rows.length; i += INSERT_BATCH_SIZE) {
    await insertBatch(rows.slice(i, i + INSERT_BATCH_SIZE));
  }
}

/**
 * @param {PingRow[]} batch
 * @returns {Promise<void>}
 */
async function insertBatch(batch) {
  /** @type {unknown[]} */
  const values = [];
  const placeholders = batch.map((row, rowIndex) => {
    const base = rowIndex * INSERT_COLUMNS.length;
    values.push(
      row.time,
      row.probeId,
      row.measurementId,
      row.dstAddr,
      row.dstName,
      row.rttAvgMs,
      row.rttMinMs,
      row.rttMaxMs,
      row.packetLossPct,
    );
    return `(${INSERT_COLUMNS.map((_, colIndex) => `$${base + colIndex + 1}`).join(", ")})`;
  });

  await pool.query(
    `INSERT INTO ping_results (${INSERT_COLUMNS.join(", ")})
     VALUES ${placeholders.join(", ")}
     ON CONFLICT DO NOTHING`,
    values,
  );
}

/**
 * Fetches mesh ping results for one city (as a target) against every other
 * city (as a source), and inserts them.
 *
 * @param {City} target
 * @param {City[]} cities
 * @returns {Promise<number>} rows ingested for this city
 */
async function ingestCity(target, cities) {
  const sourceProbeIds = cities
    .filter((city) => city.id !== target.id)
    .map((city) => city.probeId);

  const rawResults = await fetchResults(target.measurementId, sourceProbeIds);
  const rows = normalizeResults(rawResults);
  await insertRows(rows);

  console.log(`${target.name}: ingested ${rows.length} ping result(s).`);
  return rows.length;
}

/**
 * Fetches mesh ping results for every configured city (as a target) against
 * every other configured city (as a source), and inserts them into
 * `ping_results`. Safe to re-run: rows are keyed by (time, probe_id,
 * measurement_id), so re-fetching the same window just skips duplicates.
 * Cities are independent of each other, so their fetch+insert cycles run
 * concurrently rather than one after another.
 *
 * @returns {Promise<number>} total rows ingested this cycle
 */
async function runIngestCycle() {
  const { rows: cities } = /** @type {{rows: City[]}} */ (
    await pool.query(
      `SELECT id, name, probe_id AS "probeId", measurement_id AS "measurementId" FROM cities`,
    )
  );

  if (cities.length < 2) {
    console.log("Fewer than 2 cities configured, nothing to ingest.");
    return 0;
  }

  const rowCounts = await Promise.all(
    cities.map((target) => ingestCity(target, cities)),
  );
  const totalRows = rowCounts.reduce((sum, count) => sum + count, 0);

  console.log(`Cycle done. Ingested ${totalRows} ping result(s) total.`);
  return totalRows;
}

export { runIngestCycle };
