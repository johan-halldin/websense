import { html, LitElement } from "lit";
import "@websense/ui/src/button/button.wc.js";

/**
 * @typedef {object} ICounter
 * @property {number} count
 * @property {() => void} [onIncrement]
 * @property {() => void} [onDecrement]
 */

class WsCounter extends LitElement {
  /** @type {ICounter|null} */
  #ic = null;

  /** @param {ICounter} ic */
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
      <ws-button .ic=${{ title: "-", onClick: ic.onDecrement }}></ws-button>
      <span>${ic.count}</span>
      <ws-button .ic=${{ title: "+", onClick: ic.onIncrement }}></ws-button>
    `;
  }
}

customElements.define("ws-counter", WsCounter);

export { WsCounter };
