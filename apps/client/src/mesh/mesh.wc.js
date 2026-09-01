import { css, html, LitElement } from "lit";
import "@websense/ui/src/button/button.wc.js";
import { iconBaseStyle } from "@websense/ui/src/icons/icon-styles.js";
import { formatRelativeTime, formatTime } from "@websense/util";
import {
  isRttDeviationNotable,
  rttColor,
  rttDeviationPercent,
} from "./rtt-color.js";

/** @import { MeshRow } from "./mesh.jc.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */

/**
 * @typedef {object} IWsMesh
 * @property {string|null} error
 * @property {MeshRow[]} rows
 * @property {IButton} refreshButton
 * @property {IButton} ingestButton
 */

/**
 * @param {number} percent
 * @returns {{style: string, icon: "arrow-up"|"arrow-down"}}
 */
function rttBadge(percent) {
  const { color, textColor, icon } = rttColor(percent);
  return {
    style: `background-color: ${color}; color: ${textColor};`,
    icon,
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
            const percent = rttDeviationPercent(row);
            const badge = isRttDeviationNotable(percent)
              ? rttBadge(/** @type {number} */ (percent))
              : null;
            const delta =
              percent === null || percent === 0
                ? ""
                : `${percent >= 0 ? "+" : ""}${percent}%`;
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
                <td title=${formatTime(new Date(row.time))}>
                  ${formatRelativeTime(new Date(row.time))}
                </td>
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
