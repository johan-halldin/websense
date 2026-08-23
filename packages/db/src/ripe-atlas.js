const BASE_URL = "https://atlas.ripe.net/api/v2/measurements";

/**
 * @typedef {object} RipeAtlasPingResult
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

const DAY_SECONDS = 24 * 60 * 60;

/**
 * Fetches recent results (last 24h) for a public RIPE Atlas measurement,
 * filtered to a set of probes. RIPE Atlas rejects unbounded queries against
 * long-running measurements ("please request less than 365 day(s) of
 * data"), so a start/stop window is always required.
 *
 * @param {number} measurementId
 * @param {number[]} probeIds
 * @returns {Promise<RipeAtlasPingResult[]>}
 */
async function fetchResults(measurementId, probeIds) {
  const url = new URL(`${BASE_URL}/${measurementId}/results/`);
  url.searchParams.set("probe_ids", probeIds.join(","));
  const stop = Math.floor(Date.now() / 1000);
  url.searchParams.set("start", String(stop - DAY_SECONDS));
  url.searchParams.set("stop", String(stop));

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `RIPE Atlas request failed: ${response.status} ${response.statusText}`,
    );
  }

  return /** @type {Promise<RipeAtlasPingResult[]>} */ (response.json());
}

export { fetchResults };
