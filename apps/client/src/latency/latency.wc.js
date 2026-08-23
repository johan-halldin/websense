import { html, LitElement } from "lit";
import "@websense/ui/src/line-chart/line-chart.wc.js";

/**
 * @typedef {object} IWsLatency
 * @property {boolean} loading
 * @property {string|null} error
 * @property {() => {x: number, y: number}[]} getPoints
 */

class WsLatency extends LitElement {
  /** @type {IWsLatency|null} */
  #ic = null;

  /** @param {IWsLatency} ic */
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

    if (ic.loading) {
      return html`<p>Loading latency data...</p>`;
    }

    if (ic.error !== null) {
      return html`<p>Failed to load latency data: ${ic.error}</p>`;
    }

    const points = ic.getPoints();
    if (points.length === 0) {
      return html`<p>No latency data yet.</p>`;
    }

    return html`
      <h2>Latency</h2>
      <ui-line-chart .ic=${{ points }}></ui-line-chart>
    `;
  }
}

customElements.define("ws-latency", WsLatency);

export { WsLatency };
