import { css, html, LitElement } from "lit";
import "@websense/ui/src/button/button.wc.js";
import "@websense/ui/src/geo-map/geo-map.wc.js";

/** @import { IGeoMap } from "@websense/ui/src/geo-map/geo-map.wc.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */

/**
 * @typedef {object} IWorldMap
 * @property {string|null} error
 * @property {IGeoMap} geoMap
 * @property {IButton} refreshButton
 */

class WsWorldMap extends LitElement {
  /** @override */
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 0;
    }
    header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    ui-geo-map {
      flex: 1;
      min-height: 0;
    }
  `;

  /** @type {IWorldMap|null} */
  #ic = null;

  /** @param {IWorldMap} ic */
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

    const header = html`
      <header>
        <h2>World Map</h2>
        <ui-button .ic=${ic.refreshButton}></ui-button>
      </header>
    `;

    if (ic.error !== null) {
      return html`${header}
        <p>Failed to load map data: ${ic.error}</p>`;
    }

    return html`${header} <ui-geo-map .ic=${ic.geoMap}></ui-geo-map>`;
  }
}

customElements.define("ws-world-map", WsWorldMap);

export { WsWorldMap };
