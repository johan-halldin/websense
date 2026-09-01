/** @import { RipeAtlasPingResult } from "./ripe-atlas.js" */

/**
 * @typedef {object} PingRow
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
 * RIPE Atlas represents "no successful replies" two ways: by omitting
 * avg/min/max entirely, or - for some measurement types - by setting them
 * to -1. Either way it means no real RTT was measured, so both normalize
 * to `null` rather than storing a nonsensical negative millisecond value.
 *
 * @param {number|undefined} value
 * @returns {number|null}
 */
function normalizeRttMs(value) {
  return value === undefined || value < 0 ? null : value;
}

/**
 * Converts raw RIPE Atlas ping results into rows shaped for the
 * `ping_results` hypertable.
 *
 * @param {RipeAtlasPingResult[]} rawResults
 * @returns {PingRow[]}
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
      rttAvgMs: normalizeRttMs(raw.avg),
      rttMinMs: normalizeRttMs(raw.min),
      rttMaxMs: normalizeRttMs(raw.max),
      packetLossPct: sent > 0 ? (100 * (sent - rcvd)) / sent : null,
    };
  });
}

export { normalizeResults };
