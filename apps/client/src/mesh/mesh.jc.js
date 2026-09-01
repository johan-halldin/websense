import { with_blocking_spinner } from "@websense/ui/src/spinner/blocking-spinner.js";
import { show_toast } from "@websense/ui/src/toast/toast.js";
import { formatTime } from "@websense/util";
import { fetchMeshRows } from "../fetch/mesh.js";
import { subscribeToPingResultsUpdates } from "../fetch/ping-result-events.js";

/** @import { IWsMesh } from "./mesh.wc.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */
/** @import { MeshRow } from "../fetch/mesh.js" */

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
      this.#rows = await fetchMeshRows();
      this.#error = null;
    } catch (error) {
      this.#error = error instanceof Error ? error.message : String(error);
    }
  }

  /** Re-fetches mesh data - exposed for JcDashboard to call after an
   * ingest it triggered (ingestion itself is a global action, not scoped
   * to this view - see JcDashboard). */
  async refresh() {
    await this.#fetch();
  }

  /** @returns {IWsMesh} */
  getIWsMesh() {
    /** @type {IButton} */
    const refreshButton = {
      label: "Refresh",
      icon: "refresh-cw",
      onClick: () => this.#fetch(),
    };

    return {
      error: this.#error,
      rows: this.#rows,
      refreshButton,
    };
  }
}

export { JcMesh };
