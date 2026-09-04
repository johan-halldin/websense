import { isApiCorrelations } from "@websense/api-types";
import { fetchJson } from "./http.js";

/** @import { ApiCorrelation, ApiCorrelationGrouping, ApiCorrelationRange } from "@websense/api-types" */
/** @import { HttpValueResult } from "./http.js" */

/**
 * Fetches route correlations calculated from measurements grouped into shared
 * time buckets (GET /api/correlations).
 *
 * @param {ApiCorrelationRange} range
 * @param {ApiCorrelationGrouping} grouping
 * @returns {Promise<HttpValueResult<ApiCorrelation[]>>}
 */
async function fetchCorrelations(range, grouping) {
  const searchParams = new URLSearchParams({
    range,
    group: grouping,
  });
  return fetchJson(`/api/correlations?${searchParams}`, isApiCorrelations);
}

export { fetchCorrelations };
