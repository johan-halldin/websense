/**
 * @typedef {import("./ripe-atlas.js").IRipeAtlasPingResult} IRipeAtlasPingResult
 */

/**
 * @typedef {object} IPingRow
 * @property {Date} time
 * @property {number} probeId
 * @property {number} measurementId
 * @property {string} dstAddr
 * @property {string|null} dstName
 * @property {number|null} rttAvgMs
 * @property {number|null} rttMinMs
 * @property {number|null} rttMaxMs
 * @property {number|null} packetLossPct
 */

/**
 * Converts raw RIPE Atlas ping results into rows shaped for the
 * `ping_results` hypertable. A result with no successful replies (all
 * packets lost) has no `avg`/`min`/`max` fields, so those become `null`
 * rather than being dropped.
 *
 * @param {IRipeAtlasPingResult[]} rawResults
 * @returns {IPingRow[]}
 */
function normalizeResults(rawResults) {
  return rawResults.map((raw) => {
    const sent = raw.sent ?? 0;
    const rcvd = raw.rcvd ?? 0;

    return {
      time: new Date(raw.timestamp * 1000),
      probeId: raw.prb_id,
      measurementId: raw.msm_id,
      dstAddr: raw.dst_addr,
      dstName: raw.dst_name ?? null,
      rttAvgMs: raw.avg ?? null,
      rttMinMs: raw.min ?? null,
      rttMaxMs: raw.max ?? null,
      packetLossPct: sent > 0 ? (100 * (sent - rcvd)) / sent : null,
    };
  });
}

export { normalizeResults };
