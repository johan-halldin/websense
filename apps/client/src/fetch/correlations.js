/** @typedef {"week"|"month"|"year"} CorrelationRange */
/** @typedef {"hour"|"day"} CorrelationGrouping */
/** @typedef {"rtt"|"loss"} CorrelationMetric */

/**
 * @typedef {object} Correlation
 * @property {string} firstSrcName
 * @property {string} firstDstName
 * @property {string} secondSrcName
 * @property {string} secondDstName
 * @property {number} correlation
 * @property {number} sharedBuckets
 */

/**
 * Fetches route correlations calculated from measurements grouped into shared
 * time buckets (GET /api/correlations).
 *
 * @param {CorrelationRange} range
 * @param {CorrelationGrouping} grouping
 * @param {CorrelationMetric} metric
 * @returns {Promise<Correlation[]>}
 */
async function fetchCorrelations(range, grouping, metric) {
  const searchParams = new URLSearchParams({
    range,
    group: grouping,
    metric,
  });
  const response = await fetch(`/api/correlations?${searchParams}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export { fetchCorrelations };
