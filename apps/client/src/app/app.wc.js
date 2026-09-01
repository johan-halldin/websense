import { html, LitElement } from "lit";
import "../dashboard/dashboard.wc.js";

/** @import { IDashboard } from "../dashboard/dashboard.wc.js" */

/**
 * @typedef {object} IAppView
 * @property {IDashboard} dashboard
 */

class WsAppView extends LitElement {
  /**
   * Renders in light DOM (not shadow DOM) so this page's layout.css
   * utility classes (.ui-row, .ui-gap-md, etc.) apply directly - see
   * AGENTS.md. Without this, ws-dashboard (which also renders in light
   * DOM) would still sit inside this component's shadow root, cutting it
   * off from the global stylesheet.
   * @override
   */
  createRenderRoot() {
    return this;
  }

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
