/**
 * @typedef {object} CityPairMeasurement
 * @property {string} time
 * @property {number|null} rttMs
 * @property {number|null} packetLossPct
 */

/** @typedef {"day"|"week"|"month"|"year"} CityPairRange */
/** @typedef {"none"|"hour"|"day"} CityPairGrouping */

/**
 * Fetches every measurement between two cities from the server (GET
 * /api/city-pair).
 *
 * @param {number} srcId
 * @param {number} dstId
 * @param {CityPairRange} range
 * @param {CityPairGrouping} grouping
 * @returns {Promise<CityPairMeasurement[]>}
 */
async function fetchCityPairMeasurements(srcId, dstId, range, grouping) {
  const searchParams = new URLSearchParams({
    src: String(srcId),
    dst: String(dstId),
    range,
    group: grouping,
  });
  const response = await fetch(`/api/city-pair?${searchParams}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export { fetchCityPairMeasurements };
