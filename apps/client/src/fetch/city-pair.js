import { isApiCityPairMeasurements } from "@websense/api-types";

/** @import { ApiCityPairMeasurement } from "@websense/api-types" */

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
 * @returns {Promise<ApiCityPairMeasurement[]>}
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
  const measurements = await response.json();
  if (!isApiCityPairMeasurements(measurements)) {
    throw new Error("Invalid city pair response");
  }
  return measurements;
}

export { fetchCityPairMeasurements };
