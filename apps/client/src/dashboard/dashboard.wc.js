import { html, LitElement } from "lit";
import "@websense/ui/src/tabs/tabs.wc.js";
import "../mesh/mesh.wc.js";

/**
 * @typedef {import("@websense/ui/src/tabs/tabs.wc.js").ITabs} ITabs
 * @typedef {import("../mesh/mesh.wc.js").IWsMesh} IWsMesh
 */

/**
 * @typedef {object} IDashboard
 * @property {ITabs} tabs
 * @property {IWsMesh} mesh
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

    return html`
      <div class="ui-stack ui-gap-lg ui-padding-lg">
        <h1>WebSense</h1>
        <ui-tabs .ic=${ic.tabs}></ui-tabs>
        ${activeTab === "table" ? html`<ws-mesh .ic=${ic.mesh}></ws-mesh>` : ""}
        ${activeTab === "map" ? html`<p>Map view coming soon.</p>` : ""}
      </div>
    `;
  }
}

customElements.define("ws-dashboard", WsDashboard);

export { WsDashboard };
