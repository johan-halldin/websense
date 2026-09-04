import { isApiCreateCity } from "@websense/api-types";
import { query } from "@websense/db";
import { sendError, sendJson, readJsonBody } from "../http.js";

/** @import { IncomingMessage, ServerResponse } from "node:http" */

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

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
async function handleCreateCity(req, res) {
  let city;
  try {
    city = await readJsonBody(req);
  } catch {
    sendError(res, 400, "Expected a valid JSON request body");
    return;
  }

  if (!isApiCreateCity(city)) {
    sendError(
      res,
      400,
      "Expected { name: string, country: string, lat: number, lon: number, probeId: integer, measurementId: integer }",
    );
    return;
  }

  const { rows } = await query(
    `INSERT INTO cities (name, country, lat, lon, probe_id, measurement_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING
       id,
       name,
       country,
       lat,
       lon,
       probe_id AS "probeId",
       measurement_id AS "measurementId"`,
    [
      city.name,
      city.country,
      city.lat,
      city.lon,
      city.probeId,
      city.measurementId,
    ],
  );

  sendJson(res, 201, rows[0]);
}

/**
 * @param {number} id
 * @param {ServerResponse} res
 */
async function handleDeleteCity(id, res) {
  await query("DELETE FROM cities WHERE id = $1", [id]);
  res.writeHead(204);
  res.end();
}

export { handleCreateCity, handleDeleteCity, handleListCities };
