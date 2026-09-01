import { with_blocking_spinner } from "@websense/ui/src/spinner/blocking-spinner.js";
import { show_toast } from "@websense/ui/src/toast/toast.js";
import { formatTime } from "@websense/util";
import { subscribeToPingResultsUpdates } from "../ping-results-events.js";
import {
  isRttDeviationNotable,
  rttColor,
  rttDeviationPercent,
} from "./rtt-color.js";

/** @import { IWsMesh } from "./mesh.wc.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */
/** @import { IGeoMap, IGeoPoint } from "@websense/ui/src/geo-map/geo-map.wc.js" */

/**
 * @typedef {object} MeshRow
 * @property {string} srcName
 * @property {number} srcLat
 * @property {number} srcLon
 * @property {string} dstName
 * @property {number} dstLat
 * @property {number} dstLon
 * @property {string} time
 * @property {number|null} rttAvgMs
 * @property {number|null} packetLossPct
 * @property {number|null} avgRttMs
 * @property {number|null} avgPacketLossPct
 */

class JcMesh {
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
    this.#subscribeToUpdates();
  }

  /** Silently re-fetches (no blocking spinner) whenever the server pushes
   * a notification that new ping results landed - e.g. from the scheduled
   * background ingestion, not just this tab's own actions. */
  #subscribeToUpdates() {
    subscribeToPingResultsUpdates(() => {
      this.#doFetch().then(() => {
        this.#on_change();
        show_toast(`Page updated at ${formatTime(new Date())}`, {
          level: "info",
        });
      });
    });
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

  /** @returns {IGeoMap} */
  getIGeoMap() {
    /** @type {Map<string, IGeoPoint>} */
    const pointByName = new Map();
    for (const row of this.#rows) {
      if (!pointByName.has(row.srcName)) {
        pointByName.set(row.srcName, {
          label: row.srcName,
          lat: row.srcLat,
          lon: row.srcLon,
        });
      }
      if (!pointByName.has(row.dstName)) {
        pointByName.set(row.dstName, {
          label: row.dstName,
          lat: row.dstLat,
          lon: row.dstLon,
        });
      }
    }

    const edges = this.#rows.map((row) => {
      const percent = rttDeviationPercent(row);
      const color = isRttDeviationNotable(percent)
        ? rttColor(/** @type {number} */ (percent)).color
        : undefined;

      return {
        from: { label: row.srcName, lat: row.srcLat, lon: row.srcLon },
        to: { label: row.dstName, lat: row.dstLat, lon: row.dstLon },
        ...(color !== undefined ? { color } : {}),
      };
    });

    return {
      points: [...pointByName.values()],
      edges,
    };
  }
}

export { JcMesh };
