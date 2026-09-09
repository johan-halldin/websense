import {
  isApiCities,
  isApiCityPairMeasurements,
  isApiCorrelations,
  isApiMeshRows,
} from "@websense/api-types";
import { fetchJson } from "./http.js";

/** @import { ApiCity, ApiCityPairGrouping, ApiCityPairMeasurement, ApiCityPairRange, ApiCorrelation, ApiCorrelationGrouping, ApiCorrelationRange, ApiMeshRow } from "@websense/api-types" */
/** @import { HttpValueResult } from "./http.js" */

/**
 * @returns {Promise<HttpValueResult<ApiCity[]>>}
 */
async function fetchCities() {
  return fetchJson("/api/cities", isApiCities);
}

/**
 * @returns {Promise<HttpValueResult<ApiMeshRow[]>>}
 */
async function fetchMeshRows() {
  return fetchJson("/api/route-summaries", isApiMeshRows);
}

/**
 * @param {number} srcId
 * @param {number} dstId
 * @param {ApiCityPairRange} range
 * @param {ApiCityPairGrouping} grouping
 * @returns {Promise<HttpValueResult<ApiCityPairMeasurement[]>>}
 */
async function fetchRouteMeasurements(srcId, dstId, range, grouping) {
  const searchParams = new URLSearchParams({ range, group: grouping });
  return fetchJson(
    `/api/routes/${srcId}/${dstId}/measurements?${searchParams}`,
    isApiCityPairMeasurements,
  );
}

/**
 * @param {ApiCorrelationRange} range
 * @param {ApiCorrelationGrouping} grouping
 * @returns {Promise<HttpValueResult<ApiCorrelation[]>>}
 */
async function fetchCorrelations(range, grouping) {
  const searchParams = new URLSearchParams({ range, group: grouping });
  return fetchJson(
    `/api/route-correlations?${searchParams}`,
    isApiCorrelations,
  );
}

export {
  fetchCities,
  fetchRouteMeasurements,
  fetchCorrelations,
  fetchMeshRows,
};
