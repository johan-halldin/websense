import { css, html, LitElement } from "lit";
import "@websense/ui/src/button/button.wc.js";

/**
 * @typedef {import("./mesh.jc.js").IMeshRow} IMeshRow
 * @typedef {import("@websense/ui/src/button/button.wc.js").IButton} IButton
 */

/**
 * @typedef {object} IWsMesh
 * @property {boolean} loading
 * @property {string|null} error
 * @property {IMeshRow[]} rows
 * @property {IButton} refreshButton
 */

class WsMesh extends LitElement {
  /** @override */
  static styles = css`
    header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th,
    td {
      text-align: left;
      padding: 6px 12px;
      border-bottom: 1px solid var(--color-border);
    }
  `;

  /** @type {IWsMesh|null} */
  #ic = null;

  /** @param {IWsMesh} ic */
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
        <h2>Mesh</h2>
        <ui-button .ic=${ic.refreshButton}></ui-button>
      </header>
    `;

    if (ic.loading) {
      return html`${header}
        <p>Loading mesh data...</p>`;
    }

    if (ic.error !== null) {
      return html`${header}
        <p>Failed to load mesh data: ${ic.error}</p>`;
    }

    if (ic.rows.length === 0) {
      return html`${header}
        <p>No mesh data yet.</p>`;
    }

    return html`
      ${header}
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>RTT (ms)</th>
            <th>Loss (%)</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          ${ic.rows.map(
            (row) => html`
              <tr>
                <td>${row.srcName}</td>
                <td>${row.dstName}</td>
                <td>${row.rttAvgMs?.toFixed(1) ?? "—"}</td>
                <td>${row.packetLossPct?.toFixed(0) ?? "—"}</td>
                <td>${new Date(row.time).toLocaleTimeString()}</td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }
}

customElements.define("ws-mesh", WsMesh);

export { WsMesh };
