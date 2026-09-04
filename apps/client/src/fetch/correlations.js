import { sanitizeApiCorrelations } from "@websense/api-types";

/** @import { ApiCorrelation } from "@websense/api-types" */

/** @typedef {"week"|"month"|"year"} CorrelationRange */
/** @typedef {"hour"|"day"} CorrelationGrouping */

/**
 * Fetches route correlations calculated from measurements grouped into shared
 * time buckets (GET /api/correlations).
 *
 * @param {CorrelationRange} range
 * @param {CorrelationGrouping} grouping
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
  const correlations = sanitizeApiCorrelations(await response.json());
  if (correlations === null) {
    throw new Error("Invalid correlations response");
  }
  return correlations;
}

export { fetchCorrelations };
