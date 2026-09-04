import { isApiCities } from "@websense/api-types";
import { fetchJson } from "./http.js";

/** @import { ApiCity } from "@websense/api-types" */
/** @import { HttpValueResult } from "./http.js" */

/**
 * Fetches every configured city from the server (GET /api/cities).
 *
 * @returns {Promise<HttpValueResult<ApiCity[]>>}
 */
async function fetchCities() {
  return fetchJson("/api/cities", isApiCities);
}

export { fetchCities };
