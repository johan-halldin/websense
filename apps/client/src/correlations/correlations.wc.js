import { css, html, LitElement } from "lit";
import "@websense/ui/src/segmented-control/segmented-control.wc.js";

/** @import { ISegmentedControl } from "@websense/ui/src/segmented-control/segmented-control.wc.js" */
/** @import { Correlation } from "../fetch/correlations.js" */

/**
 * @typedef {object} ICorrelations
 * @property {ISegmentedControl} rangeControl
 * @property {ISegmentedControl} groupingControl
 * @property {ISegmentedControl} metricControl
 * @property {Correlation[]} symmetricRows
 * @property {Correlation[]} otherRows
 * @property {string|null} error
 */

class WsCorrelations extends LitElement {
  /** @override */
  static styles = css`
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
      margin: var(--space-md) 0;
    }
    .control {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      font-size: 14px;
      color: var(--color-text);
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th,
    td {
      padding: var(--space-sm);
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }
    th {
      color: var(--color-text-muted);
      font-size: 14px;
      font-weight: 500;
    }
    .number {
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
  `;

  /** @type {ICorrelations|null} */
  #ic = null;

  /** @param {ICorrelations} ic */
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
      <section>
        <h2>Correlations</h2>
        <p>
          Routes are compared only in shared time buckets, then ordered by
          correlation strength.
        </p>
        ${ic.error !== null ? html`<p>Failed to load: ${ic.error}</p>` : ""}
        <div class="controls">
          <label class="control">
            <span>Time range</span>
            <ui-segmented-control .ic=${ic.rangeControl}></ui-segmented-control>
          </label>
          <label class="control">
            <span>Average measurements</span>
            <ui-segmented-control
              .ic=${ic.groupingControl}
            ></ui-segmented-control>
          </label>
          <label class="control">
            <span>Metric</span>
            <ui-segmented-control
              .ic=${ic.metricControl}
            ></ui-segmented-control>
          </label>
        </div>
        ${this.#renderTable(
          "Reverse directions",
          "The same city pair measured in both directions.",
          ic.symmetricRows,
        )}
        ${this.#renderTable(
          "Other route pairs",
          "Routes that are not opposite directions of the same city pair.",
          ic.otherRows,
        )}
      </section>
    `;
  }

  /**
   * @param {string} heading
   * @param {string} description
   * @param {Correlation[]} rows
   */
  #renderTable(heading, description, rows) {
    return html`
      <section>
        <h3>${heading}</h3>
        <p>${description}</p>
        ${
          rows.length > 0
            ? html`
                <table>
                  <thead>
                    <tr>
                      <th>First route</th>
                      <th>Second route</th>
                      <th class="number">Correlation</th>
                      <th class="number">Shared buckets</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rows.map(
                      (row) => html`
                        <tr>
                          <td>${row.firstSrcName} → ${row.firstDstName}</td>
                          <td>${row.secondSrcName} → ${row.secondDstName}</td>
                          <td class="number">${row.correlation.toFixed(2)}</td>
                          <td class="number">${row.sharedBuckets}</td>
                        </tr>
                      `,
                    )}
                  </tbody>
                </table>
              `
            : html`<p>No correlations have enough shared measurements yet.</p>`
        }
      </section>
    `;
  }
}

customElements.define("ws-correlations", WsCorrelations);

export { WsCorrelations };
