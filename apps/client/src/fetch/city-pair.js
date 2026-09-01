/**
 * @typedef {object} CityPairMeasurement
 * @property {string} time
 * @property {number|null} rttMs
 * @property {number|null} packetLossPct
 */

/**
 * Fetches every measurement between two cities from the server (GET
 * /api/city-pair).
 *
 * @param {number} srcId
 * @param {number} dstId
 * @returns {Promise<CityPairMeasurement[]>}
 */
async function fetchCityPairMeasurements(srcId, dstId) {
  const response = await fetch(`/api/city-pair?src=${srcId}&dst=${dstId}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export { fetchCityPairMeasurements };
