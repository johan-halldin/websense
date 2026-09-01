import { html, LitElement } from "lit";
import "@websense/ui/src/geo-map/geo-map.wc.js";
import "@websense/ui/src/tabs/tabs.wc.js";
import "../city-pair/city-pair.wc.js";
import "../mesh/mesh.wc.js";

/**
 * @typedef {import("@websense/ui/src/tabs/tabs.wc.js").ITabs} ITabs
 * @typedef {import("../mesh/mesh.wc.js").IWsMesh} IWsMesh
 * @typedef {import("@websense/ui/src/geo-map/geo-map.wc.js").IGeoMap} IGeoMap
 * @typedef {import("../city-pair/city-pair.wc.js").ICityPair} ICityPair
 */

/**
 * @typedef {object} IDashboard
 * @property {ITabs} tabs
 * @property {IWsMesh} mesh
 * @property {IGeoMap} geoMap
 * @property {ICityPair} cityPair
 */

class WsDashboard extends LitElement {
  /**
   * Renders in light DOM (not shadow DOM) so this page's layout.css
   * utility classes (.ui-row, .ui-gap-md, etc.) apply directly - see
   * AGENTS.md.
   * @override
   */
  createRenderRoot() {
    return this;
  }

  /** @type {IDashboard|null} */
  #ic = null;

  /** @param {IDashboard} ic */
  set ic(ic) {
    this.#ic = ic;
    this.requestUpdate();
  }

  /** @override */
  render() {
    const ic = this.#ic;
    if (ic === null) {
      return "";
    }

    const activeTab = ic.tabs.value;
    const isMapTab = activeTab === "map";

    return html`
      <div
        class="ui-stack ui-gap-lg ui-padding-lg ${
          isMapTab ? "ui-fill-viewport" : ""
        }"
      >
        <h1>WebSense</h1>
        <ui-tabs .ic=${ic.tabs}></ui-tabs>
        ${activeTab === "table" ? html`<ws-mesh .ic=${ic.mesh}></ws-mesh>` : ""}
        ${
          isMapTab
            ? html`<ui-geo-map class="ui-flex-1" .ic=${ic.geoMap}></ui-geo-map>`
            : ""
        }
        ${
          activeTab === "city-pair"
            ? html`<ws-city-pair .ic=${ic.cityPair}></ws-city-pair>`
            : ""
        }
      </div>
    `;
  }
}

customElements.define("ws-dashboard", WsDashboard);

export { WsDashboard };
