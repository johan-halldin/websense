import { css, html, LitElement } from "lit";
import "@websense/ui/src/button/button.wc.js";
import { iconBaseStyle } from "@websense/ui/src/icons/icon-styles.js";

/**
 * @typedef {import("./mesh.jc.js").MeshRow} MeshRow
 * @typedef {import("@websense/ui/src/button/button.wc.js").IButton} IButton
 */

/**
 * @typedef {object} IWsMesh
 * @property {boolean} loading
 * @property {string|null} error
 * @property {MeshRow[]} rows
 * @property {IButton} refreshButton
 * @property {IButton} ingestButton
 */

/** Deviations smaller than this are treated as noise - no badge shown. */
const MIN_DEVIATION = 0.01;
/** A deviation of this size (or more) from a pair's own average RTT reaches
 * full badge color strength - deviations between MIN_DEVIATION and this are
 * shown as a proportionally fainter tint. */
const MAX_DEVIATION = 0.15;
/** Floor badge tint strength for any shown deviation, so one just past
 * MIN_DEVIATION is still visible rather than nearly transparent. */
const MIN_INTENSITY = 0.15;

/**
 * @param {MeshRow} row
 * @returns {number|null} signed fraction, e.g. 0.05 means 5% above average
 */
function rttDeviation(row) {
  if (row.rttAvgMs === null || row.avgRttMs === null || row.avgRttMs === 0) {
    return null;
  }
  return (row.rttAvgMs - row.avgRttMs) / row.avgRttMs;
}

/**
 * @param {number} deviation
 * @returns {{style: string, icon: "arrow-up"|"arrow-down"}}
 */
function rttBadge(deviation) {
  const magnitude = Math.min(Math.abs(deviation) / MAX_DEVIATION, 1);
  const intensity = Math.round(Math.max(magnitude, MIN_INTENSITY) * 100);
  const token = deviation >= 0 ? "error" : "success";
  return {
    style: `background-color: color-mix(in srgb, var(--color-${token}) ${intensity}%, transparent); color: var(--color-${token}-700);`,
    icon: deviation >= 0 ? "arrow-up" : "arrow-down",
  };
}

class WsMesh extends LitElement {
  /** @override */
  static styles = [
    iconBaseStyle,
    css`
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
      .rtt-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 13px;
      }
      .rtt-badge .delta {
        font-size: 11px;
        opacity: 0.8;
      }
      .rtt-badge .icon {
        --icon-scale: 0.7;
      }
    `,
  ];

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
        <ui-button .ic=${ic.ingestButton}></ui-button>
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
            <th>Avg RTT (ms)</th>
            <th>Loss (%)</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          ${ic.rows.map((row) => {
            const deviation = rttDeviation(row);
            const showBadge =
              deviation !== null && Math.abs(deviation) >= MIN_DEVIATION;
            const badge = showBadge ? rttBadge(deviation) : null;
            const delta =
              deviation === null
                ? ""
                : `${deviation >= 0 ? "+" : ""}${(deviation * 100).toFixed(0)}%`;
            return html`
              <tr>
                <td>${row.srcName}</td>
                <td>${row.dstName}</td>
                <td>
                  <span class="rtt-badge" style=${badge?.style ?? ""}>
                    ${row.rttAvgMs?.toFixed(1) ?? "—"}
                    ${
                      badge !== null
                        ? html`<span
                            class="icon"
                            style="mask-image: var(--icon-${badge.icon}); -webkit-mask-image: var(--icon-${badge.icon});"
                          ></span>`
                        : ""
                    }
                    ${delta ? html`<span class="delta">${delta}</span>` : ""}
                  </span>
                </td>
                <td>${row.avgRttMs?.toFixed(1) ?? "—"}</td>
                <td>${row.packetLossPct?.toFixed(0) ?? "—"}</td>
                <td>${new Date(row.time).toLocaleTimeString()}</td>
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  }
}

customElements.define("ws-mesh", WsMesh);

export { WsMesh };
