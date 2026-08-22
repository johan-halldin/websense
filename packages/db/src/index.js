import { pool } from "./pool.js";

/**
 * @param {string} text
 * @param {unknown[]} [params]
 * @returns {Promise<import("pg").QueryResult>}
 */
function query(text, params) {
  return pool.query(text, params);
}

export { query };
