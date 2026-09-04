import {
  isApiCities,
  isApiCityPairMeasurements,
  isApiCorrelations,
  isApiIngest,
  isApiMeshRows,
} from "@websense/api-types";
import { fetchJson } from "./http.js";

/** @import { ApiCity, ApiCityPairGrouping, ApiCityPairMeasurement, ApiCityPairRange, ApiCorrelation, ApiCorrelationGrouping, ApiCorrelationRange, ApiIngest, ApiMeshRow } from "@websense/api-types" */
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
async function fetchCityPairMeasurements(srcId, dstId, range, grouping) {
  const searchParams = new URLSearchParams({
    src: String(srcId),
    dst: String(dstId),
    range,
    group: grouping,
  });
  return fetchJson(`/api/city-pair?${searchParams}`, isApiCityPairMeasurements);
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

/**
 * @returns {Promise<HttpValueResult<ApiIngest>>}
 */
async function fetchIngest() {
  return fetchJson("/api/ingest", isApiIngest, { method: "POST" });
}

export {
  fetchCities,
  fetchCityPairMeasurements,
  fetchCorrelations,
  fetchIngest,
  fetchMeshRows,
};
