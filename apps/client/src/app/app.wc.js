import { html, LitElement } from "lit";
import "@websense/ui/src/button/button.wc.js";
import "../dashboard/dashboard.wc.js";
import "./counter.wc.js";

/**
 * @typedef {import("./counter.wc.js").ICounter} ICounter
 * @typedef {import("../dashboard/dashboard.wc.js").IDashboard} IDashboard
 */

/**
 * @typedef {object} IAppView
 * @property {string} status
 * @property {() => void} onRefresh
 * @property {ICounter} counter
 * @property {IDashboard} dashboard
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
      <ui-button
        .ic=${{ label: "Refresh", onClick: () => ic.onRefresh() }}
      ></ui-button>
      <ws-counter .ic=${ic.counter}></ws-counter>
      <ws-dashboard .ic=${ic.dashboard}></ws-dashboard>
    `;
  }
}

customElements.define("ws-app-view", WsAppView);

export { WsAppView };
