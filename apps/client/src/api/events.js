/**
 * Subscribes to the server's generic change signal. JcApp lives for the
 * application's lifetime, so its EventSource does too.
 *
 * @param {() => void} onChange
 */
function subscribeToServerChanges(onChange) {
  const source = new EventSource("/api/events");
  source.onmessage = onChange;
}

export { subscribeToServerChanges };
