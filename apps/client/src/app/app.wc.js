import { html, LitElement } from "lit";
import "@websense/ui/src/button.wc.js";

/**
 * @typedef {object} IAppView
 * @property {() => string} getStatus
 * @property {() => void} onRefresh
 */

class WsAppView extends LitElement {
  /** @type {IAppView|null} */
  #ic = null;

  /** @param {IAppView} ic */
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

    return html`
      <h1>WebSense</h1>
      <p>Server status: ${ic.getStatus()}</p>
      <ws-button @click=${() => ic.onRefresh()}>Refresh</ws-button>
    `;
  }
}

customElements.define("ws-app-view", WsAppView);

export { WsAppView };
