import { css, html, LitElement } from "lit";
import "@websense/ui/src/select/select.wc.js";
import { formatTime } from "@websense/util";

/** @import { ISelect } from "@websense/ui/src/select/select.wc.js" */
/** @import { CityPairMeasurement } from "./city-pair.jc.js" */

/**
 * @typedef {object} ICityPair
 * @property {ISelect} srcSelect
 * @property {ISelect} dstSelect
 * @property {CityPairMeasurement[]} rows
 */

class WsCityPair extends LitElement {
  /** @override */
  static styles = css`
    .selectors {
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

  /** @type {ICityPair|null} */
  #ic = null;

  /** @param {ICityPair} ic */
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

    const selectors = html`
      <div class="selectors">
        <ui-select .ic=${ic.srcSelect}></ui-select>
        <span>→</span>
        <ui-select .ic=${ic.dstSelect}></ui-select>
      </div>
    `;

    if (ic.rows.length === 0) {
      return html`${selectors}
        <p>Select two cities to see measurements between them.</p>`;
    }

    return html`
      ${selectors}
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>RTT (ms)</th>
            <th>Loss (%)</th>
          </tr>
        </thead>
        <tbody>
          ${ic.rows.map(
            (row) => html`
              <tr>
                <td title=${row.time}>${formatTime(new Date(row.time))}</td>
                <td>${row.rttMs.toFixed(1)}</td>
                <td>${row.packetLossPct.toFixed(0)}</td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }
}

customElements.define("ws-city-pair", WsCityPair);

export { WsCityPair };
