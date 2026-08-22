const BASE_URL = "https://atlas.ripe.net/api/v2/measurements";

/**
 * @typedef {object} IRipeAtlasPingResult
 * @property {number} prb_id
 * @property {number} msm_id
 * @property {number} timestamp
 * @property {string} dst_addr
 * @property {string} [dst_name]
 * @property {number} [avg]
 * @property {number} [min]
 * @property {number} [max]
 * @property {number} [sent]
 * @property {number} [rcvd]
 */

/**
 * Fetches the latest results for a public RIPE Atlas measurement, filtered
 * to a set of probes.
 *
 * @param {number} measurementId
 * @param {number[]} probeIds
 * @returns {Promise<IRipeAtlasPingResult[]>}
 */
async function fetchResults(measurementId, probeIds) {
  const url = new URL(`${BASE_URL}/${measurementId}/results/`);
  url.searchParams.set("probe_ids", probeIds.join(","));

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `RIPE Atlas request failed: ${response.status} ${response.statusText}`,
    );
  }

  return /** @type {Promise<IRipeAtlasPingResult[]>} */ (response.json());
}

export { fetchResults };
