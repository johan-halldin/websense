import { isApiMeshRows } from "@websense/api-types";
import { fetchJson } from "./http.js";

/** @import { ApiMeshRow } from "@websense/api-types" */
/** @import { HttpValueResult } from "./http.js" */

/**
 * Fetches every mesh row from the server (GET /api/mesh) - shared by
 * JcMesh and JcWorldMap, which both present the same underlying
 * ping-results data (as a table vs. as map points/edges).
 *
 * @returns {Promise<HttpValueResult<ApiMeshRow[]>>}
 */
async function fetchMeshRows() {
  return fetchJson("/api/mesh", isApiMeshRows);
}

export { fetchMeshRows };
