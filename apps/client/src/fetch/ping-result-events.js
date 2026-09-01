/** @type {EventSource|null} */
let source = null;
/** @type {Set<() => void>} */
const listeners = new Set();

/**
 * Subscribes to the server's ping-results-updated SSE stream (apps/server's
 * GET /api/events). Lazily opens a single shared EventSource on first use
 * instead of a fresh one per view - views live for the whole app lifetime,
 * so there's no need to ever close it again.
 *
 * @param {() => void} onUpdate
 */
function subscribeToPingResultsUpdates(onUpdate) {
  if (source === null) {
    source = new EventSource("/api/events");
    source.onmessage = () => {
      for (const listener of listeners) {
        listener();
      }
    };
  }
  listeners.add(onUpdate);
}

export { subscribeToPingResultsUpdates };
