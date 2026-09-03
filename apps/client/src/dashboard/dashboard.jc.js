import { with_blocking_spinner } from "@websense/ui/src/spinner/blocking-spinner.js";
import { show_toast } from "@websense/ui/src/toast/toast.js";
import { JcCityPair } from "../city-pair/city-pair.jc.js";
import { JcCorrelations } from "../correlations/correlations.jc.js";
import { JcMesh } from "../mesh/mesh.jc.js";
import { JcWorldMap } from "../world-map/world-map.jc.js";

/** @import { IDashboard } from "./dashboard.wc.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */

class JcDashboard {
  /** @type {() => void} */
  #on_change;
  /** @type {JcMesh} */
  #mesh;
  /** @type {JcWorldMap} */
  #worldMap;
  /** @type {JcCityPair} */
  #cityPair;
  /** @type {JcCorrelations} */
  #correlations;
  /** @type {string} */
  #activeTab = "mesh";

  /** @param {() => void} on_change */
  constructor(on_change) {
    this.#on_change = on_change;
    this.#mesh = new JcMesh(on_change);
    this.#worldMap = new JcWorldMap(on_change);
    this.#cityPair = new JcCityPair(on_change);
    this.#correlations = new JcCorrelations(on_change);
  }

  /** Ingestion refreshes data for every city pair, not just the mesh table,
   * so it lives here rather than in JcMesh. */
  async #ingest() {
    await with_blocking_spinner(this.#doIngest(), "Ingesting...");
  }

  async #doIngest() {
    try {
      const response = await fetch("/api/ingest", { method: "POST" });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      await Promise.all([this.#mesh.refresh(), this.#worldMap.refresh()]);
    } catch (error) {
      show_toast(error instanceof Error ? error.message : String(error), {
        level: "error",
      });
    }
  }

  /** Re-fetches all server-backed dashboard data without showing a blocking
   * spinner. JcApp calls this in response to the server's generic change
   * signal. */
  async refreshFromServerChange() {
    await Promise.all([
      this.#mesh.refreshFromServerChange(),
      this.#worldMap.refreshFromServerChange(),
      this.#cityPair.refreshFromServerChange(),
      this.#correlations.refreshFromServerChange(),
    ]);
  }

  /** @returns {IDashboard} */
  getIDashboard() {
    /** @type {IButton} */
    const ingestButton = {
      label: "Ingest now",
      icon: "download",
      onClick: () => this.#ingest(),
    };

    return {
      tabs: {
        value: this.#activeTab,
        options: [
          { value: "mesh", label: "Mesh", icon: "mesh" },
          { value: "world-map", label: "World Map", icon: "world-map" },
          { value: "city-pair", label: "City Pair", icon: "link" },
          { value: "correlations", label: "Correlations", icon: "correlation" },
        ],
        onChange: (value) => {
          this.#activeTab = value;
          this.#on_change();
        },
      },
      ingestButton,
      mesh: this.#mesh.getIWsMesh(),
      worldMap: this.#worldMap.getIWorldMap(),
      cityPair: this.#cityPair.getICityPair(),
      correlations: this.#correlations.getICorrelations(),
    };
  }
}

export { JcDashboard };
