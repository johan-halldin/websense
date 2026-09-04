import { css, html, LitElement } from "lit";
import "@websense/ui/src/badge/badge.wc.js";
import "@websense/ui/src/button/button.wc.js";
import "@websense/ui/src/segmented-control/segmented-control.wc.js";

/** @import { IBadge } from "@websense/ui/src/badge/badge.wc.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */
/** @import { ISegmentedControl } from "@websense/ui/src/segmented-control/segmented-control.wc.js" */
/** @import { ApiCorrelation } from "@websense/api-types" */

/**
 * @typedef {object} ICorrelations
 * @property {IButton} refreshButton
 * @property {ISegmentedControl} rangeControl
 * @property {ISegmentedControl} groupingControl
 * @property {ApiCorrelation[]} symmetricRows
 * @property {ApiCorrelation[]} otherRows
 * @property {string|null} error
 */

class WsCorrelations extends LitElement {
  /** @override */
  static styles = css`
    header {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }
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
    const maxSharedBuckets = Math.max(
      0,
      ...ic.symmetricRows.map((row) => row.sharedBuckets),
      ...ic.otherRows.map((row) => row.sharedBuckets),
    );

    return html`
      <section>
        <header>
          <h2>Correlations</h2>
          <ui-button .ic=${ic.refreshButton}></ui-button>
        </header>
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
        </div>
        ${this.#renderTable(
          "Reverse directions",
          "The same city pair measured in both directions.",
          ic.symmetricRows,
          maxSharedBuckets,
        )}
        ${this.#renderTable(
          "Other route pairs",
          "Routes that are not opposite directions of the same city pair.",
          ic.otherRows,
          maxSharedBuckets,
        )}
      </section>
    `;
  }

  /**
   * @param {string} heading
   * @param {string} description
   * @param {ApiCorrelation[]} rows
   * @param {number} maxSharedBuckets
   */
  #renderTable(heading, description, rows, maxSharedBuckets) {
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
                          <td class="number">
                            <ui-badge
                              .ic=${this.#correlationBadge(row.correlation)}
                            ></ui-badge>
                          </td>
                          <td class="number">
                            <ui-badge
                              .ic=${this.#sharedBucketsBadge(
                                row.sharedBuckets,
                                maxSharedBuckets,
                              )}
                            ></ui-badge>
                          </td>
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

  /**
   * @param {number} correlation
   * @returns {IBadge}
   */
  #correlationBadge(correlation) {
    const color =
      correlation < 0
        ? {
            backgroundColor: "var(--color-secondary-200)",
            textColor: "var(--color-secondary-900)",
          }
        : {
            backgroundColor: "var(--color-primary-100)",
            textColor: "var(--color-primary-700)",
          };
    return {
      label: correlation.toFixed(2),
      tooltip: `Correlation: ${correlation.toFixed(4)}`,
      size: "sm",
      ...color,
    };
  }

  /**
   * @param {number} sharedBuckets
   * @param {number} maxSharedBuckets
   * @returns {IBadge}
   */
  #sharedBucketsBadge(sharedBuckets, maxSharedBuckets) {
    const relativeSupport = sharedBuckets / maxSharedBuckets;
    const color =
      relativeSupport >= 0.75
        ? {
            backgroundColor: "var(--color-gray-700)",
            textColor: "var(--color-white)",
          }
        : relativeSupport >= 0.5
          ? {
              backgroundColor: "var(--color-gray-500)",
              textColor: "var(--color-white)",
            }
          : relativeSupport >= 0.25
            ? {
                backgroundColor: "var(--color-gray-300)",
                textColor: "var(--color-gray-900)",
              }
            : {
                backgroundColor: "var(--color-gray-100)",
                textColor: "var(--color-gray-700)",
              };
    return {
      label: String(sharedBuckets),
      tooltip: `${sharedBuckets} shared time buckets`,
      size: "sm",
      ...color,
    };
  }
}

customElements.define("ws-correlations", WsCorrelations);

export { WsCorrelations };
