import { css, html, LitElement } from "lit";
import { repeat } from "lit/directives/repeat.js";
import "@websense/ui/src/button/button.wc.js";
import "@websense/ui/src/icon-button/icon-button.wc.js";
import "@websense/ui/src/line-chart/line-chart.wc.js";
import "@websense/ui/src/select/select.wc.js";

/** @import { ISelect } from "@websense/ui/src/select/select.wc.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */
/** @import { IIconButton } from "@websense/ui/src/icon-button/icon-button.wc.js" */
/** @import { ILineChart } from "@websense/ui/src/line-chart/line-chart.wc.js" */

/**
 * @typedef {object} ICityPairRow
 * @property {string} id
 * @property {ISelect} srcSelect
 * @property {ISelect} dstSelect
 * @property {IIconButton} removeButton
 */

/**
 * @typedef {object} ICityPair
 * @property {IButton} refreshButton
 * @property {IButton} addRandomPairButton
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
          </div>
        `,
      )}

      <div class="add-pair">
        <ui-button .ic=${ic.addRandomPairButton}></ui-button>
      </div>
    `;
  }
}

customElements.define("ws-city-pair", WsCityPair);

export { WsCityPair };
