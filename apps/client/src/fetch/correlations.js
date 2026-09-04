import { isApiCorrelations } from "@websense/api-types";

/** @import { ApiCorrelation, ApiCorrelationGrouping, ApiCorrelationRange } from "@websense/api-types" */

/**
 * Fetches route correlations calculated from measurements grouped into shared
 * time buckets (GET /api/correlations).
 *
 * @param {ApiCorrelationRange} range
 * @param {ApiCorrelationGrouping} grouping
 * @returns {Promise<ApiCorrelation[]>}
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
  const correlations = await response.json();
  if (!isApiCorrelations(correlations)) {
    throw new Error("Invalid correlations response");
  }
  return correlations;
}

export { fetchCorrelations };
