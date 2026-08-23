/**
 * @typedef {import("./mesh.wc.js").IWsMesh} IWsMesh
 */

/**
 * @typedef {object} IMeshRow
 * @property {string} srcName
 * @property {string} dstName
 * @property {string} time
 * @property {number|null} rttAvgMs
 * @property {number|null} packetLossPct
 */

class Mesh {
  /** @type {() => void} */
  #on_change;
  /** @type {boolean} */
  #loading = true;
  /** @type {string|null} */
  #error = null;
  /** @type {IMeshRow[]} */
  #rows = [];

  /** @param {() => void} on_change */
  constructor(on_change) {
    this.#on_change = on_change;
    this.#fetch();
  }

  async #fetch() {
    try {
      const response = await fetch("/api/mesh");
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

  /** @returns {IWsMesh} */
  getIWsMesh() {
    return {
      loading: this.#loading,
      error: this.#error,
      rows: this.#rows,
    };
  }
}

export { Mesh };
