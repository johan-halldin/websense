import { html, LitElement } from "lit";
import "../dashboard/dashboard.wc.js";

/** @import { IDashboard } from "../dashboard/dashboard.wc.js" */

/**
 * @typedef {object} IAppView
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

    return html`<ws-dashboard .ic=${ic.dashboard}></ws-dashboard>`;
  }
}

customElements.define("ws-app-view", WsAppView);

export { WsAppView };
