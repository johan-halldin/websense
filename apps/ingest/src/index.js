import { runIngestCycle } from "./run.js";

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const intervalMs = Number(process.env.INGEST_INTERVAL_MS);

if (Number.isFinite(intervalMs) && intervalMs > 0) {
  console.log(`Looping every ${intervalMs}ms.`);
  for (;;) {
    try {
      await runIngestCycle();
    } catch (error) {
      console.error(error);
    }
    await sleep(intervalMs);
  }
} else {
  await runIngestCycle();
  process.exit(0);
}
