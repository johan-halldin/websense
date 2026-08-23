import { Client } from "pg";

const CHANNEL = "ping_results_updated";
const RECONNECT_DELAY_MS = 2000;

/**
 * Subscribes to Postgres NOTIFY events fired by the trigger in
 * db/migrations/0003_notify_ping_results.sql whenever `ping_results` gets
 * new rows. Uses its own dedicated connection rather than the shared pool,
 * since a LISTENing connection has to stay open indefinitely and can't be
 * recycled like a pooled one. Reconnects automatically if the connection
 * drops.
 *
 * @param {() => void} onNotify
 * @returns {void}
 */
function listenForPingResultsUpdates(onNotify) {
  let reconnectScheduled = false;

  const scheduleReconnect = () => {
    if (reconnectScheduled) {
      return;
    }
    reconnectScheduled = true;
    setTimeout(() => {
      reconnectScheduled = false;
      connect();
    }, RECONNECT_DELAY_MS);
  };

  function connect() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });

    client.on("notification", (message) => {
      if (message.channel === CHANNEL) {
        onNotify();
      }
    });
    client.on("error", (error) => {
      console.error("LISTEN connection error:", error);
    });
    client.on("end", scheduleReconnect);

    client
      .connect()
      .then(() => client.query(`LISTEN ${CHANNEL}`))
      .catch((error) => {
        console.error("Failed to connect for LISTEN:", error);
        scheduleReconnect();
      });
  }

  connect();
}

export { listenForPingResultsUpdates };
