import { isApiCityPairGrouping, isApiCityPairRange } from "@websense/api-types";
import { query } from "@websense/db";
import { isPositiveInteger } from "@websense/util";
import { sendError, sendJson } from "../http.js";

/** @import { ServerResponse } from "node:http" */

/**
 * @param {URLSearchParams} searchParams
 * @param {ServerResponse} res
 */
async function handleCityPair(searchParams, res) {
  const srcId = Number(searchParams.get("src"));
  const dstId = Number(searchParams.get("dst"));
  const range = searchParams.get("range") ?? "day";
  const grouping = searchParams.get("group") ?? "none";

  if (
    !isPositiveInteger(srcId) ||
    !isPositiveInteger(dstId) ||
    !isApiCityPairRange(range) ||
    !isApiCityPairGrouping(grouping)
  ) {
    sendError(
      res,
      400,
      "Expected ?src=<cityId>&dst=<cityId>&range=day|week|month|year&group=none|hour|day",
    );
    return;
  }
  const rangeInterval =
    range === "day"
      ? "1 day"
      : range === "week"
        ? "1 week"
        : range === "month"
          ? "1 month"
          : "1 year";
  const groupingInterval =
    grouping === "none" ? null : grouping === "hour" ? "1 hour" : "1 day";

  const baseQuery = `FROM ping_results
     JOIN cities src ON src.probe_id = ping_results.probe_id AND src.id = $1
     JOIN cities dst
       ON dst.measurement_id = ping_results.measurement_id AND dst.id = $2
     WHERE ping_results.time >= NOW() - $3::interval`;
  const selectRtt = `CASE
       WHEN ping_results.rtt_avg_ms < 0 THEN NULL
       ELSE ping_results.rtt_avg_ms
     END`;
  const result =
    groupingInterval === null
      ? await query(
          `SELECT
       ping_results.time,
       ${selectRtt} AS "rttMs",
       ping_results.packet_loss_pct AS "packetLossPct"
     ${baseQuery}
     ORDER BY ping_results.time DESC`,
          [srcId, dstId, rangeInterval],
        )
      : await query(
          `SELECT
             time_bucket($4::interval, ping_results.time) AS time,
             avg(${selectRtt}) AS "rttMs",
             avg(ping_results.packet_loss_pct) AS "packetLossPct"
           ${baseQuery}
           GROUP BY 1
           ORDER BY time DESC`,
          [srcId, dstId, rangeInterval, groupingInterval],
        );

  sendJson(res, 200, result.rows);
}

export { handleCityPair };
