import { listenForPingResultsUpdates } from "@websense/db";

/** @import { ServerResponse } from "node:http" */

/** @type {Set<ServerResponse>} */
const clients = new Set();

/** An ingest cycle inserts in many batches, each firing its own NOTIFY -
 * coalesce a burst of them into a single broadcast once things go quiet. */
const NOTIFY_DEBOUNCE_MS = 500;
/** @type {NodeJS.Timeout|null} */
let broadcastTimer = null;

listenForPingResultsUpdates(() => {
  if (broadcastTimer !== null) {
    clearTimeout(broadcastTimer);
  }
  broadcastTimer = setTimeout(() => {
    broadcastTimer = null;
    for (const client of clients) {
      client.write("data: server-changed\n\n");
    }
  }, NOTIFY_DEBOUNCE_MS);
});

/**
 * Opens an SSE connection for generic server-change signals.
 *
 * @param {ServerResponse} res
 */
function handleEvents(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("\n");
  clients.add(res);
  res.on("close", () => clients.delete(res));
}

export { handleEvents };
