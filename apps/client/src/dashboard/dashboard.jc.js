import { JcCityPair } from "../city-pair/city-pair.jc.js";
import { JcMesh } from "../mesh/mesh.jc.js";

/** @import { IDashboard } from "./dashboard.wc.js" */

class JcDashboard {
  /** @type {() => void} */
  #on_change;
  /** @type {JcMesh} */
  #mesh;
  /** @type {JcCityPair} */
  #cityPair;
  /** @type {string} */
  #activeTab = "table";

  /** @param {() => void} on_change */
  constructor(on_change) {
    this.#on_change = on_change;
    this.#mesh = new JcMesh(on_change);
    this.#cityPair = new JcCityPair(on_change);
  }

  /** @returns {IDashboard} */
  getIDashboard() {
    return {
      tabs: {
        value: this.#activeTab,
        options: [
          { value: "table", label: "Table", icon: "list-filter" },
          { value: "map", label: "Map", icon: "image" },
          { value: "city-pair", label: "City Pair", icon: "link" },
        ],
        onChange: (value) => {
          this.#activeTab = value;
          this.#on_change();
        },
      },
      mesh: this.#mesh.getIWsMesh(),
      geoMap: this.#mesh.getIGeoMap(),
      cityPair: this.#cityPair.getICityPair(),
    };
  }
}

export { JcDashboard };
