import { with_blocking_spinner } from "@websense/ui/src/spinner/blocking-spinner.js";
import { show_toast } from "@websense/ui/src/toast/toast.js";
import { formatTime } from "@websense/util";
import { fetchMeshRows } from "../fetch/mesh.js";
import {
  isRttDeviationNotable,
  rttColor,
  rttDeviationPercent,
} from "../mesh/rtt-color.js";
import { subscribeToPingResultsUpdates } from "../fetch/ping-result-events.js";

/** @import { IWorldMap } from "./world-map.wc.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */
/** @import { IGeoPoint } from "@websense/ui/src/geo-map/geo-map.wc.js" */
/** @import { MeshRow } from "../fetch/mesh.js" */

class JcWorldMap {
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
    await with_blocking_spinner(this.#doFetch(), "Loading map data...");
    this.#on_change();
  }

  /** Re-fetches map data - exposed for JcDashboard to call after an
   * ingest it triggered (ingestion itself is a global action, not scoped
   * to this view - see JcDashboard). */
  async refresh() {
    await this.#fetch();
  }

  async #doFetch() {
    try {
      this.#rows = await fetchMeshRows();
      this.#error = null;
    } catch (error) {
      this.#error = error instanceof Error ? error.message : String(error);
    }
  }

  /** @returns {IWorldMap} */
  getIWorldMap() {
    /** @type {IButton} */
    const refreshButton = {
      label: "Refresh",
      icon: "refresh-cw",
      onClick: () => this.#fetch(),
    };

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
      error: this.#error,
      refreshButton,
      geoMap: {
        points: [...pointByName.values()],
        edges,
      },
    };
  }
}

export { JcWorldMap };
