/**
 * @typedef {object} MeshRow
 * @property {string} srcName
 * @property {number} srcLat
 * @property {number} srcLon
 * @property {string} dstName
 * @property {number} dstLat
 * @property {number} dstLon
 * @property {string} time
 * @property {number|null} rttAvgMs
 * @property {number|null} packetLossPct
 * @property {number|null} avgRttMs
 * @property {number|null} avgPacketLossPct
 */

/**
 * Fetches every mesh row from the server (GET /api/mesh) - shared by
 * JcMesh and JcWorldMap, which both present the same underlying
 * ping-results data (as a table vs. as map points/edges).
 *
 * @returns {Promise<MeshRow[]>}
 */
async function fetchMeshRows() {
  const response = await fetch("/api/mesh");
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export { fetchMeshRows };
