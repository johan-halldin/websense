import { sanitizeApiMeshRows } from "@websense/api-types";

/** @import { ApiMeshRow } from "@websense/api-types" */

/**
 * Fetches every mesh row from the server (GET /api/mesh) - shared by
 * JcMesh and JcWorldMap, which both present the same underlying
 * ping-results data (as a table vs. as map points/edges).
 *
 * @returns {Promise<ApiMeshRow[]>}
 */
async function fetchMeshRows() {
  const response = await fetch("/api/mesh");
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const rows = sanitizeApiMeshRows(await response.json());
  if (rows === null) {
    throw new Error("Invalid mesh response");
  }
  return rows;
}

export { fetchMeshRows };
