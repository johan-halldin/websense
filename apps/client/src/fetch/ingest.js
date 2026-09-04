import { isApiIngest } from "@websense/api-types";
import { fetchJson } from "./http.js";

/** @import { ApiIngest } from "@websense/api-types" */
/** @import { HttpValueResult } from "./http.js" */

/**
 * Starts a server ingest cycle (POST /api/ingest).
 *
 * @returns {Promise<HttpValueResult<ApiIngest>>}
 */
async function fetchIngest() {
  return fetchJson("/api/ingest", isApiIngest, { method: "POST" });
}

export { fetchIngest };
