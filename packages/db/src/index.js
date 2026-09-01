import { pool } from "./pool.js";

/** @import { QueryResult } from "pg" */

/**
 * @param {string} text
 * @param {unknown[]} [params]
 * @returns {Promise<QueryResult>}
 */
function query(text, params) {
  return pool.query(text, params);
}

export { query };
export { listenForPingResultsUpdates } from "./listen.js";
export { runIngestCycle } from "./run.js";
