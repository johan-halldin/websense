import { query } from "@websense/db";
import { sendJson } from "../http.js";

/** @import { ServerResponse } from "node:http" */

/**
 * @param {ServerResponse} res
 */
async function handleListCities(res) {
  const { rows } = await query(
    `SELECT
       id,
       name,
       country,
       lat,
       lon,
       probe_id AS "probeId",
       measurement_id AS "measurementId"
     FROM cities
     ORDER BY name ASC`,
  );

  sendJson(res, 200, rows);
}

export { handleListCities };
