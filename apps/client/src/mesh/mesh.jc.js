/**
 * @typedef {import("./mesh.wc.js").IWsMesh} IWsMesh
 * @typedef {import("@websense/ui/src/button/button.wc.js").IButton} IButton
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
  /** @type {boolean} */
  #ingesting = false;
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
    this.#loading = true;
    this.#on_change();
    try {
      const response = await fetch("/api/mesh");
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      this.#rows = await response.json();
      this.#error = null;
    } catch (error) {
      this.#error = error instanceof Error ? error.message : String(error);
    } finally {
      this.#loading = false;
      this.#on_change();
    }
  }

  async #ingest() {
    this.#ingesting = true;
    this.#on_change();
    try {
      const response = await fetch("/api/ingest", { method: "POST" });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
    } catch (error) {
      this.#error = error instanceof Error ? error.message : String(error);
    } finally {
      this.#ingesting = false;
    }
    await this.#fetch();
  }

  /** @returns {IWsMesh} */
  getIWsMesh() {
    const busy = this.#loading || this.#ingesting;

    /** @type {IButton} */
    const refreshButton = {
      label: "Refresh",
      icon: "refresh-cw",
      ...(busy ? {} : { onClick: () => this.#fetch() }),
    };

    /** @type {IButton} */
    const ingestButton = {
      label: this.#ingesting ? "Ingesting..." : "Ingest now",
      icon: "download",
      ...(busy ? {} : { onClick: () => this.#ingest() }),
    };

    return {
      loading: this.#loading,
      error: this.#error,
      rows: this.#rows,
      refreshButton,
      ingestButton,
    };
  }
}

export { Mesh };
