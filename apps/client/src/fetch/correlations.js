/** @typedef {"week"|"month"|"year"} CorrelationRange */
/** @typedef {"hour"|"day"} CorrelationGrouping */

/**
 * @typedef {object} Correlation
 * @property {string} firstSrcName
 * @property {string} firstDstName
 * @property {string} secondSrcName
 * @property {string} secondDstName
 * @property {number} correlation
 * @property {number} sharedBuckets
 * @property {boolean} isSymmetric
 */

/**
 * Fetches route correlations calculated from measurements grouped into shared
 * time buckets (GET /api/correlations).
 *
 * @param {CorrelationRange} range
 * @param {CorrelationGrouping} grouping
 * @returns {Promise<Correlation[]>}
 */
async function fetchCorrelations(range, grouping) {
  const searchParams = new URLSearchParams({
    range,
    group: grouping,
  });
  const response = await fetch(`/api/correlations?${searchParams}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export { fetchCorrelations };
