/**
 * @typedef {import("./latency.wc.js").IWsLatency} IWsLatency
 */

/**
 * @typedef {object} IMeasurementRow
 * @property {string} time
 * @property {number} probeId
 * @property {number|null} rttAvgMs
 */

class Latency {
  /** @type {() => void} */
  #on_change;
  /** @type {boolean} */
  #loading = true;
  /** @type {string|null} */
  #error = null;
  /** @type {IMeasurementRow[]} */
  #rows = [];

  /** @param {() => void} on_change */
  constructor(on_change) {
    this.#on_change = on_change;
    this.#fetch();
  }

  async #fetch() {
    try {
      const response = await fetch("/api/measurements");
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      this.#rows = await response.json();
    } catch (error) {
      this.#error = error instanceof Error ? error.message : String(error);
    } finally {
      this.#loading = false;
      this.#on_change();
    }
  }

  /** @returns {IWsLatency} */
  getIWsLatency() {
    return {
      loading: this.#loading,
      error: this.#error,
      getPoints: () =>
        this.#rows
          .filter((row) => row.rttAvgMs !== null)
          .map((row) => ({
            x: new Date(row.time).getTime(),
            y: /** @type {number} */ (row.rttAvgMs),
          })),
    };
  }
}

export { Latency };
