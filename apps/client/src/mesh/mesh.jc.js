import { with_blocking_spinner } from "@websense/ui/src/spinner/blocking-spinner.js";

/**
 * @typedef {import("./mesh.wc.js").IWsMesh} IWsMesh
 * @typedef {import("@websense/ui/src/button/button.wc.js").IButton} IButton
 */

/**
 * @typedef {object} MeshRow
 * @property {string} srcName
 * @property {string} dstName
 * @property {string} time
 * @property {number|null} rttAvgMs
 * @property {number|null} packetLossPct
 * @property {number|null} avgRttMs
 * @property {number|null} avgPacketLossPct
 */

class Mesh {
  /** @type {() => void} */
  #on_change;
  /** @type {string|null} */
  #error = null;
  /** @type {MeshRow[]} */
  #rows = [];

  /** @param {() => void} on_change */
  constructor(on_change) {
    this.#on_change = on_change;
    this.#fetch();
  }

  async #fetch() {
    await with_blocking_spinner(this.#doFetch(), "Loading mesh data...");
    this.#on_change();
  }

  async #doFetch() {
    try {
      const response = await fetch("/api/mesh");
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      this.#rows = await response.json();
      this.#error = null;
    } catch (error) {
      this.#error = error instanceof Error ? error.message : String(error);
    }
  }

  async #ingest() {
    await with_blocking_spinner(this.#doIngest(), "Ingesting...");
    await this.#fetch();
  }

  async #doIngest() {
    try {
      const response = await fetch("/api/ingest", { method: "POST" });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
    } catch (error) {
      this.#error = error instanceof Error ? error.message : String(error);
    }
  }

  /** @returns {IWsMesh} */
  getIWsMesh() {
    /** @type {IButton} */
    const refreshButton = {
      label: "Refresh",
      icon: "refresh-cw",
      onClick: () => this.#fetch(),
    };

    /** @type {IButton} */
    const ingestButton = {
      label: "Ingest now",
      icon: "download",
      onClick: () => this.#ingest(),
    };

    return {
      error: this.#error,
      rows: this.#rows,
      refreshButton,
      ingestButton,
    };
  }
}

export { Mesh };
