import { css, html, LitElement } from "lit";
import { repeat } from "lit/directives/repeat.js";
import "@websense/ui/src/button/button.wc.js";
import "@websense/ui/src/icon-button/icon-button.wc.js";
import "@websense/ui/src/line-chart/line-chart.wc.js";
import "@websense/ui/src/select/select.wc.js";
import { formatTime } from "@websense/util";

/** @import { ISelect } from "@websense/ui/src/select/select.wc.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */
/** @import { IIconButton } from "@websense/ui/src/icon-button/icon-button.wc.js" */
/** @import { ILineChart } from "@websense/ui/src/line-chart/line-chart.wc.js" */
/** @import { CityPairMeasurement } from "../fetch/city-pair.js" */

/**
 * @typedef {object} ICityPairRow
 * @property {string} id
 * @property {ISelect} srcSelect
 * @property {ISelect} dstSelect
 * @property {IIconButton} removeButton
 * @property {CityPairMeasurement[]} rows
 */

/**
 * @typedef {object} ICityPair
 * @property {IButton} refreshButton
 * @property {IButton} addPairButton
 * @property {ICityPairRow[]} pairs
 * @property {string|null} error
 * @property {ILineChart} chart
 */

class WsCityPair extends LitElement {
  /** @override */
  static styles = css`
    header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .pair {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--color-border);
    }
    .pair-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    table {
      margin-top: 12px;
      border-collapse: collapse;
      width: 100%;
    }
    th,
    td {
      text-align: left;
      padding: 6px 12px;
      border-bottom: 1px solid var(--color-border);
    }
    .add-pair {
      margin-top: 16px;
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

    const hasChartData = ic.chart.series.length > 0;

    return html`
      <header>
        <h2>City Pair</h2>
        <ui-button .ic=${ic.refreshButton}></ui-button>
      </header>

      ${ic.error !== null ? html`<p>Failed to load: ${ic.error}</p>` : ""}
      ${hasChartData ? html`<ui-line-chart .ic=${ic.chart}></ui-line-chart>` : ""}
      ${repeat(
        ic.pairs,
        (pair) => pair.id,
        (pair) => html`
          <div class="pair">
            <div class="pair-controls">
              <ui-select .ic=${pair.srcSelect}></ui-select>
              <span>→</span>
              <ui-select .ic=${pair.dstSelect}></ui-select>
              <ui-icon-button .ic=${pair.removeButton}></ui-icon-button>
            </div>
            ${
              pair.rows.length === 0
                ? html`<p>No measurements yet.</p>`
                : html`
                    <table>
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>RTT (ms)</th>
                          <th>Loss (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${pair.rows.map(
                          (row) => html`
                            <tr>
                              <td title=${row.time}>
                                ${formatTime(new Date(row.time))}
                              </td>
                              <td>${row.rttMs?.toFixed(1) ?? "—"}</td>
                              <td>${row.packetLossPct?.toFixed(0) ?? "—"}</td>
                            </tr>
                          `,
                        )}
                      </tbody>
                    </table>
                  `
            }
          </div>
        `,
      )}

      <div class="add-pair">
        <ui-button .ic=${ic.addPairButton}></ui-button>
      </div>
    `;
  }
}

customElements.define("ws-city-pair", WsCityPair);

export { WsCityPair };
