/** @import { IncomingMessage, ServerResponse } from "node:http" */

/**
 * Reads and parses a JSON request body.
 *
 * @param {IncomingMessage} req
 * @returns {Promise<unknown>}
 */
async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

/**
 * @param {ServerResponse} res
 * @param {number} status
 * @param {unknown} body
 */
function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

/**
 * @param {ServerResponse} res
 * @param {number} status
 * @param {string} error
 */
function sendError(res, status, error) {
  sendJson(res, status, { error });
}

export { readJsonBody, sendError, sendJson };
