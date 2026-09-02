/** @import { MeshRow } from "../fetch/mesh.js" */

/** Deviations smaller than this (in whole percent, post-rounding) are
 * treated as noise - no color shown. Rounding first, then thresholding the
 * rounded value, keeps this in agreement with any displayed delta text -
 * otherwise a raw 0.6% could round to a displayed "+1%" while still failing
 * a threshold check against the unrounded 0.006. */
const MIN_DEVIATION_PERCENT = 5;
/** A deviation of this size (or more) from a pair's own average RTT reaches
 * full color strength - deviations between MIN_DEVIATION_PERCENT and this
 * are shown as a proportionally fainter tint. */
const MAX_DEVIATION_PERCENT = 15;
/** Floor color intensity for any shown deviation, so one just past
 * MIN_DEVIATION_PERCENT is still visible rather than nearly transparent. */
const MIN_INTENSITY = 0.15;
/** Once a color is at least this saturated, dark `-700` text no longer has
 * good contrast against it - switch to white. */
const INTENSITY_FOR_LIGHT_TEXT = 0.6;

/**
 * @param {MeshRow} row
 * @returns {number|null} signed whole percent, e.g. 5 means 5% above average
 */
function rttDeviationPercent(row) {
  if (row.rttAvgMs === null || row.avgRttMs === null || row.avgRttMs === 0) {
    return null;
  }
  return Math.round(((row.rttAvgMs - row.avgRttMs) / row.avgRttMs) * 100);
}

/**
 * @param {number|null} percent
 * @returns {boolean} whether this deviation is large enough to color at all
 */
function isRttDeviationNotable(percent) {
  return percent !== null && Math.abs(percent) >= MIN_DEVIATION_PERCENT;
}

/**
 * @param {number} percent
 * @returns {{color: string, textColor: string, icon: "arrow-up"|"arrow-down"}}
 */
function rttColor(percent) {
  const magnitude = Math.min(Math.abs(percent) / MAX_DEVIATION_PERCENT, 1);
  const intensity = Math.max(magnitude, MIN_INTENSITY);
  const token = percent >= 0 ? "error" : "success";
  const textColor =
    intensity >= INTENSITY_FOR_LIGHT_TEXT
      ? `var(--color-on-${token})`
      : `var(--color-${token}-700)`;
  return {
    color: `color-mix(in srgb, var(--color-${token}) ${Math.round(intensity * 100)}%, transparent)`,
    textColor,
    icon: percent >= 0 ? "arrow-up" : "arrow-down",
  };
}

export { isRttDeviationNotable, rttColor, rttDeviationPercent };
