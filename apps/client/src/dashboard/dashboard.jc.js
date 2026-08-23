import { Mesh } from "../mesh/mesh.jc.js";

/**
 * @typedef {import("./dashboard.wc.js").IDashboard} IDashboard
 */

class Dashboard {
  /** @type {() => void} */
  #on_change;
  /** @type {Mesh} */
  #mesh;
  /** @type {string} */
  #activeTab = "table";

  /** @param {() => void} on_change */
  constructor(on_change) {
    this.#on_change = on_change;
    this.#mesh = new Mesh(on_change);
  }

  /** @returns {IDashboard} */
  getIDashboard() {
    return {
      tabs: {
        value: this.#activeTab,
        options: [
          { value: "table", label: "Table", icon: "list-filter" },
          { value: "map", label: "Map", icon: "image" },
        ],
        onChange: (value) => {
          this.#activeTab = value;
          this.#on_change();
        },
      },
      mesh: this.#mesh.getIWsMesh(),
      geoMap: this.#mesh.getIGeoMap(),
    };
  }
}

export { Dashboard };
