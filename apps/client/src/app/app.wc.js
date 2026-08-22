import { html, LitElement } from "lit";
import "@websense/ui/src/button/button.wc.js";
import "./counter.wc.js";

/**
 * @typedef {import("./counter.wc.js").ICounter} ICounter
 */

/**
 * @typedef {object} IAppView
 * @property {string} status
 * @property {() => void} onRefresh
 * @property {ICounter} counter
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
      <p>Server status: ${ic.status}</p>
      <ws-button
        .ic=${{ title: "Refresh", onClick: () => ic.onRefresh() }}
      ></ws-button>
      <ws-counter .ic=${ic.counter}></ws-counter>
    `;
  }
}

customElements.define("ws-app-view", WsAppView);

export { WsAppView };
