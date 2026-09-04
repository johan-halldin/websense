import { runIngestCycle } from "@websense/db";
import { sendJson } from "../http.js";

/** @import { ServerResponse } from "node:http" */

/**
 * @param {ServerResponse} res
 */
async function handleIngest(res) {
  const totalRows = await runIngestCycle();
  sendJson(res, 200, { totalRows });
}

export { handleIngest };
