import { isApiCityPairMeasurements } from "@websense/api-types";
import { fetchJson } from "./http.js";

/** @import { ApiCityPairGrouping, ApiCityPairMeasurement, ApiCityPairRange } from "@websense/api-types" */
/** @import { HttpValueResult } from "./http.js" */

/**
 * Fetches every measurement between two cities from the server (GET
 * /api/city-pair).
 *
 * @param {number} srcId
 * @param {number} dstId
 * @param {ApiCityPairRange} range
 * @param {ApiCityPairGrouping} grouping
 * @returns {Promise<HttpValueResult<ApiCityPairMeasurement[]>>}
 */
async function fetchCityPairMeasurements(srcId, dstId, range, grouping) {
  const searchParams = new URLSearchParams({
    src: String(srcId),
    dst: String(dstId),
    range,
    group: grouping,
  });
  return fetchJson(`/api/city-pair?${searchParams}`, isApiCityPairMeasurements);
}

export { fetchCityPairMeasurements };
