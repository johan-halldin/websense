import {
  isApiCorrelationGrouping,
  isApiCorrelationRange,
} from "@websense/api-types";
import { query } from "@websense/db";
import { sendError, sendJson } from "../http.js";

/** @import { ServerResponse } from "node:http" */

/**
 * @param {URLSearchParams} searchParams
 * @param {ServerResponse} res
 */
async function handleListRouteCorrelations(searchParams, res) {
  const range = searchParams.get("range") ?? "week";
  const grouping = searchParams.get("group") ?? "hour";

  if (!isApiCorrelationRange(range) || !isApiCorrelationGrouping(grouping)) {
    sendError(res, 400, "Expected ?range=week|month|year&group=hour|day");
    return;
  }
  const rangeInterval =
    range === "week" ? "1 week" : range === "month" ? "1 month" : "1 year";
  const groupingInterval = grouping === "hour" ? "1 hour" : "1 day";

  const minSharedBuckets = groupingInterval === "1 hour" ? 24 : 7;
  const { rows } = await query(
    `WITH bucketed AS MATERIALIZED (
       SELECT
         src.id AS src_id,
         dst.id AS dst_id,
         time_bucket($2::interval, ping_results.time) AS bucket,
         avg(
           CASE
             WHEN ping_results.rtt_avg_ms < 0 THEN NULL
             ELSE ping_results.rtt_avg_ms
           END
         ) AS value
       FROM ping_results
       JOIN cities src ON src.probe_id = ping_results.probe_id
       JOIN cities dst ON dst.measurement_id = ping_results.measurement_id
       WHERE ping_results.time >= NOW() - $1::interval
       GROUP BY 1, 2, 3
     ),
     correlations AS (
       SELECT
         first_route.src_id AS first_src_id,
         first_route.dst_id AS first_dst_id,
         second_route.src_id AS second_src_id,
         second_route.dst_id AS second_dst_id,
         corr(first_route.value, second_route.value) AS correlation,
         count(*) AS shared_buckets
       FROM bucketed first_route
       JOIN bucketed second_route
         ON second_route.bucket = first_route.bucket
         AND (second_route.src_id, second_route.dst_id) >
           (first_route.src_id, first_route.dst_id)
       WHERE first_route.value IS NOT NULL AND second_route.value IS NOT NULL
       GROUP BY 1, 2, 3, 4
       HAVING count(*) >= $3
     )
     SELECT
       first_src.name AS "firstSrcName",
       first_dst.name AS "firstDstName",
       second_src.name AS "secondSrcName",
       second_dst.name AS "secondDstName",
       correlations.correlation,
       correlations.shared_buckets AS "sharedBuckets",
       (
         correlations.first_src_id = correlations.second_dst_id
         AND correlations.first_dst_id = correlations.second_src_id
       ) AS "isSymmetric"
     FROM correlations
     JOIN cities first_src ON first_src.id = correlations.first_src_id
     JOIN cities first_dst ON first_dst.id = correlations.first_dst_id
     JOIN cities second_src ON second_src.id = correlations.second_src_id
     JOIN cities second_dst ON second_dst.id = correlations.second_dst_id
     WHERE correlations.correlation IS NOT NULL
     ORDER BY abs(correlations.correlation) DESC
     LIMIT 100`,
    [rangeInterval, groupingInterval, minSharedBuckets],
  );

  sendJson(res, 200, rows);
}

export { handleListRouteCorrelations };
