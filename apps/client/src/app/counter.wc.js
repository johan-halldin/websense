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
      <ui-button
        .ic=${{ icon: "minus", tooltip: "Decrement", onClick: ic.onDecrement }}
      ></ui-button>
      <span>${ic.count}</span>
      <ui-button
        .ic=${{ icon: "plus", tooltip: "Increment", onClick: ic.onIncrement }}
      ></ui-button>
    `;
  }
}

customElements.define("ws-counter", WsCounter);

export { WsCounter };
