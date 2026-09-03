import { html, LitElement } from "lit";
import "@websense/ui/src/button/button.wc.js";
import "@websense/ui/src/tabs/tabs.wc.js";
import { iconBaseStyle } from "@websense/ui/src/icons/icon-styles.js";
import { layoutStyle } from "@websense/ui/src/layout-style.js";
import "../city-pair/city-pair.wc.js";
import "../mesh/mesh.wc.js";
import "../world-map/world-map.wc.js";

/** @import { ITabs } from "@websense/ui/src/tabs/tabs.wc.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */
/** @import { IWsMesh } from "../mesh/mesh.wc.js" */
/** @import { IWorldMap } from "../world-map/world-map.wc.js" */
/** @import { ICityPair } from "../city-pair/city-pair.wc.js" */

/**
 * @typedef {object} IDashboard
 * @property {ITabs} tabs
 * @property {IButton} ingestButton
 * @property {IWsMesh} mesh
 * @property {IWorldMap} worldMap
 * @property {ICityPair} cityPair
 */

class WsDashboard extends LitElement {
  /** @override */
  static styles = [iconBaseStyle, layoutStyle];

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
    const isMapTab = activeTab === "world-map";

    return html`
      <div
        class="ui-stack ui-gap-lg ui-padding-lg ${
          isMapTab ? "ui-fill-viewport" : ""
        }"
      >
        <div class="ui-row ui-gap-md ui-align-center">
          <h1 class="ui-row ui-gap-sm ui-align-center">
            <span
              class="icon"
              style="mask-image: var(--icon-web); -webkit-mask-image: var(--icon-web); --icon-scale: 1.5;"
            ></span>
            WebSense
          </h1>
          <ui-button .ic=${ic.ingestButton}></ui-button>
        </div>
        <ui-tabs .ic=${ic.tabs}></ui-tabs>
        ${activeTab === "mesh" ? html`<ws-mesh .ic=${ic.mesh}></ws-mesh>` : ""}
        ${
          isMapTab
            ? html`<ws-world-map
                class="ui-flex-1"
                .ic=${ic.worldMap}
              ></ws-world-map>`
            : ""
        }
        ${
          activeTab === "city-pair"
            ? html`<ws-city-pair .ic=${ic.cityPair}></ws-city-pair>`
            : ""
        }
        ${
          activeTab === "correlations"
            ? html`
                <section class="ui-stack ui-gap-sm">
                  <h2>Correlations</h2>
                  <p>
                    Explore routes that degrade or recover together, helping
                    identify shared regional or provider-level events.
                  </p>
                </section>
              `
            : ""
        }
      </div>
    `;
  }
}

customElements.define("ws-dashboard", WsDashboard);

export { WsDashboard };
