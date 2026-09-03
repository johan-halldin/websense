import { css, html, LitElement } from "lit";
import "@websense/ui/src/badge/badge.wc.js";
import "@websense/ui/src/button/button.wc.js";
import { formatRelativeTime, formatTime } from "@websense/util";
import {
  isRttDeviationNotable,
  rttColor,
  rttDeviationPercent,
} from "./rtt-color.js";

/** @import { TemplateResult } from "lit" */
/** @import { MeshRow } from "../fetch/mesh.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */

/**
 * @typedef {object} IWsMesh
 * @property {string|null} error
 * @property {MeshRow[]} rows
 * @property {IButton} refreshButton
 */

/**
 * @param {number} percent
 * @returns {{backgroundColor: string, textColor: string}}
 */
function rttBadge(percent) {
  const { color, textColor } = rttColor(percent);
  return {
    backgroundColor: color,
    textColor,
  };
}

const AVG_RTT_GRAY_STEPS = [
  "var(--color-gray-50)",
  "var(--color-gray-200)",
  "var(--color-gray-400)",
  "var(--color-gray-600)",
  "var(--color-gray-800)",
];

/**
 * Maps an avg RTT reading onto a grayscale chip - white for the lowest
 * (best) averages in the current data, darkening toward the highest
 * (worst), scaled relative to `min`/`max` across every row currently shown
 * rather than any fixed ms thresholds.
 *
 * @param {number} avgRttMs
 * @param {number} min
 * @param {number} max
 * @returns {{backgroundColor: string, textColor: string}}
 */
function avgRttBadge(avgRttMs, min, max) {
  const normalized = max === min ? 0 : (avgRttMs - min) / (max - min);
  const stepIndex = Math.min(
    AVG_RTT_GRAY_STEPS.length - 1,
    Math.floor(normalized * AVG_RTT_GRAY_STEPS.length),
  );
  const textColor =
    stepIndex >= AVG_RTT_GRAY_STEPS.length - 2
      ? "var(--color-white)"
      : "var(--color-text)";
  return {
    backgroundColor: AVG_RTT_GRAY_STEPS[stepIndex] ?? "var(--color-background)",
    textColor,
  };
}

/**
 * Groups rows by source city, preserving each city's first-seen order (the
 * server already sorts by src name, so this just splits that flat list into
 * per-city chunks rather than re-sorting anything).
 *
 * @param {MeshRow[]} rows
 * @returns {Map<string, MeshRow[]>}
 */
function groupBySrc(rows) {
  /** @type {Map<string, MeshRow[]>} */
  const bySrc = new Map();
  for (const row of rows) {
    const group = bySrc.get(row.srcName);
    if (group === undefined) {
      bySrc.set(row.srcName, [row]);
    } else {
      group.push(row);
    }
  }
  return bySrc;
}

/**
 * @param {number|null} packetLossPct
 * @returns {TemplateResult|string}
 */
function renderPacketLoss(packetLossPct) {
  if (packetLossPct === null) {
    return "—";
  }
  if (packetLossPct === 0) {
    return "0";
  }

  const isTotalLoss = packetLossPct >= 100;
  return html`<ui-badge
    .ic=${{
      label: `${packetLossPct.toFixed(0)}%`,
      icon: isTotalLoss ? "circle-alert" : "triangle-alert",
      backgroundColor: isTotalLoss
        ? "var(--color-error)"
        : "var(--color-warning)",
      textColor: isTotalLoss
        ? "var(--color-on-error)"
        : "var(--color-on-warning)",
    }}
  ></ui-badge>`;
}

/**
 * @param {MeshRow} row
 * @param {number} minAvgRttMs
 * @param {number} maxAvgRttMs
 * @returns {TemplateResult}
 */
function renderRow(row, minAvgRttMs, maxAvgRttMs) {
  const percent = rttDeviationPercent(row);
  const badge = isRttDeviationNotable(percent)
    ? rttBadge(/** @type {number} */ (percent))
    : null;
  const delta =
    percent === null || percent === 0
      ? ""
      : `${percent >= 0 ? "+" : ""}${percent}%`;
  const rttLabel = `${row.rttAvgMs?.toFixed(1) ?? "—"}${
    badge !== null && percent !== null
      ? ` ${percent > 0 ? "↑" : "↓"} ${delta}`
      : ""
  }`;

  return html`
    <tr>
      <td>${row.dstName}</td>
      <td>
        <ui-badge .ic=${{ label: rttLabel, ...badge }}></ui-badge>
      </td>
      <td>
        ${
          row.avgRttMs !== null
            ? html`<ui-badge
                .ic=${{
                  label: row.avgRttMs.toFixed(1),
                  ...avgRttBadge(row.avgRttMs, minAvgRttMs, maxAvgRttMs),
                }}
              ></ui-badge>`
            : "—"
        }
      </td>
      <td>${renderPacketLoss(row.packetLossPct)}</td>
      <td title=${formatTime(new Date(row.time))}>
        ${formatRelativeTime(new Date(row.time))}
      </td>
    </tr>
  `;
}

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
      margin-bottom: 24px;
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

    if (ic.error !== null) {
      return html`${header}
        <p>Failed to load mesh data: ${ic.error}</p>`;
    }

    if (ic.rows.length === 0) {
      return html`${header}
        <p>No mesh data yet.</p>`;
    }

    const avgRttValues = /** @type {number[]} */ (
      ic.rows.map((row) => row.avgRttMs).filter((value) => value !== null)
    );
    const minAvgRttMs = avgRttValues.length > 0 ? Math.min(...avgRttValues) : 0;
    const maxAvgRttMs = avgRttValues.length > 0 ? Math.max(...avgRttValues) : 0;

    return html`
      ${header}
      ${[...groupBySrc(ic.rows)].map(
        ([srcName, rows]) => html`
          <h3>${srcName}</h3>
          <table>
            <thead>
              <tr>
                <th>To</th>
                <th>RTT (ms)</th>
                <th>Avg RTT (ms)</th>
                <th>Loss (%)</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => renderRow(row, minAvgRttMs, maxAvgRttMs))}
            </tbody>
          </table>
        `,
      )}
    `;
  }
}

customElements.define("ws-mesh", WsMesh);

export { WsMesh };
