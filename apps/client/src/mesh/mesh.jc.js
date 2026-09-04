import { with_blocking_spinner } from "@websense/ui/src/spinner/blocking-spinner.js";
import { httpResultErrorMessage } from "../fetch/http.js";
import { fetchMeshRows } from "../fetch/mesh.js";

/** @import { IWsMesh } from "./mesh.wc.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */
/** @import { ApiMeshRow } from "@websense/api-types" */

class JcMesh {
  /** @type {() => void} */
  #on_change;
  /** @type {string|null} */
  #error = null;
  /** @type {ApiMeshRow[]} */
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
      const response = await fetchMeshRows();
      if (response.type !== "HTTP OK") {
        this.#error = httpResultErrorMessage(response);
        return;
      }
      this.#rows = response.value;
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

  /** Silently re-fetches data after the app receives a server change. */
  async refreshFromServerChange() {
    await this.#doFetch();
    this.#on_change();
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
