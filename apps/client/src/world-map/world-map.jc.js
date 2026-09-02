import { with_blocking_spinner } from "@websense/ui/src/spinner/blocking-spinner.js";
import { show_toast } from "@websense/ui/src/toast/toast.js";
import { formatTime } from "@websense/util";
import { fetchMeshRows } from "../fetch/mesh.js";
import {
  isRttDeviationNotable,
  rttColor,
  rttDeviationPercent,
} from "../mesh/rtt-color.js";
import { subscribeToPingResultsUpdates } from "../fetch/ping-result-events.js";

/** @import { IWorldMap } from "./world-map.wc.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */
/** @import { IGeoPoint } from "@websense/ui/src/geo-map/geo-map.wc.js" */
/** @import { MeshRow } from "../fetch/mesh.js" */

/**
 * @typedef {object} CityStats
 * @property {number} total
 * @property {number} degraded - notably slower than that connection's own average
 * @property {number} improved - notably faster than that connection's own average
 */

/**
 * Wilson score interval's lower bound for a binomial proportion - used
 * instead of a raw degraded/total share so a city with only a couple of
 * measured connections needs much stronger evidence of trouble than one
 * with a dozen before it reads as unhealthy. At k=0 this is exactly 0
 * regardless of n; otherwise it grows toward the raw share as n grows and
 * shrinks toward 0 as n shrinks, for the same raw share.
 *
 * @param {number} degraded
 * @param {number} total
 * @param {number} [z] - z-score for the confidence level, defaults to a
 *   standard 95% (1.96)
 * @returns {number}
 */
function wilsonLowerBound(degraded, total, z = 1.96) {
  const p = degraded / total;
  const z2 = z * z;
  const denominator = 1 + z2 / total;
  const center = p + z2 / (2 * total);
  const margin =
    z * Math.sqrt((p * (1 - p)) / total + z2 / (4 * total * total));
  return (center - margin) / denominator;
}

/** Colors a city dot using the same red/green error/success tokens the
 * mesh view's per-connection chips use (rtt-color.js's rttColor), so a
 * dot, the lines feeding into it, and the mesh table all read as one
 * consistent scale. Unlike rttColor's edge/chip output, this returns a
 * solid token rather than a color-mix blended with transparent - a dot's
 * own CSS opacity (.point.notable, boosted further on :hover) already
 * carries "how notable", so baking a second, independent alpha into the
 * fill color itself would make a hovered dot look partly see-through even
 * at `opacity: 1`.
 *
 * Each direction (degraded vs. improved) gets its own Wilson lower bound
 * (see above); whichever is larger is the dot's dominant story, scaled by
 * 100 and signed (positive = degraded/red, negative = improved/green) so
 * its own 0.15 "clearly notable" cutoff lines up with rtt-color.js's
 * MAX_DEVIATION_PERCENT (15).
 *
 * @param {CityStats|undefined} stats
 * @returns {string|undefined}
 */
function cityStatusColor(stats) {
  if (stats === undefined) {
    return undefined;
  }
  const degradedBound =
    stats.degraded > 0 ? wilsonLowerBound(stats.degraded, stats.total) : 0;
  const improvedBound =
    stats.improved > 0 ? wilsonLowerBound(stats.improved, stats.total) : 0;
  if (degradedBound === 0 && improvedBound === 0) {
    return undefined;
  }

  const percent =
    (degradedBound >= improvedBound ? degradedBound : -improvedBound) * 100;
  if (!isRttDeviationNotable(percent)) {
    return undefined;
  }
  return percent >= 0 ? "var(--color-error)" : "var(--color-success)";
}

class JcWorldMap {
  /** @type {() => void} */
  #on_change;
  /** @type {string|null} */
  #error = null;
  /** @type {MeshRow[]} */
  #rows = [];

  /** @param {() => void} on_change */
  constructor(on_change) {
    this.#on_change = on_change;
    this.#fetch();
    this.#subscribeToUpdates();
  }

  /** Silently re-fetches (no blocking spinner) whenever the server pushes
   * a notification that new ping results landed - e.g. from the scheduled
   * background ingestion, not just this tab's own actions. */
  #subscribeToUpdates() {
    subscribeToPingResultsUpdates(() => {
      this.#doFetch().then(() => {
        this.#on_change();
        show_toast(`Page updated at ${formatTime(new Date())}`, {
          level: "info",
        });
      });
    });
  }

  async #fetch() {
    await with_blocking_spinner(this.#doFetch(), "Loading map data...");
    this.#on_change();
  }

  /** Re-fetches map data - exposed for JcDashboard to call after an
   * ingest it triggered (ingestion itself is a global action, not scoped
   * to this view - see JcDashboard). */
  async refresh() {
    await this.#fetch();
  }

  async #doFetch() {
    try {
      this.#rows = await fetchMeshRows();
      this.#error = null;
    } catch (error) {
      this.#error = error instanceof Error ? error.message : String(error);
    }
  }

  /** @returns {IWorldMap} */
  getIWorldMap() {
    /** @type {IButton} */
    const refreshButton = {
      label: "Refresh",
      icon: "refresh-cw",
      onClick: () => this.#fetch(),
    };

    /** @type {Map<string, CityStats>} */
    const statsByName = new Map();
    for (const row of this.#rows) {
      const percent = rttDeviationPercent(row);
      const notable = isRttDeviationNotable(percent);
      const degraded = notable && /** @type {number} */ (percent) > 0;
      const improved = notable && /** @type {number} */ (percent) < 0;
      for (const name of [row.srcName, row.dstName]) {
        const stats = statsByName.get(name) ?? {
          total: 0,
          degraded: 0,
          improved: 0,
        };
        stats.total += 1;
        if (degraded) {
          stats.degraded += 1;
        }
        if (improved) {
          stats.improved += 1;
        }
        statsByName.set(name, stats);
      }
    }

    /** @type {Map<string, IGeoPoint>} */
    const pointByName = new Map();
    for (const row of this.#rows) {
      if (!pointByName.has(row.srcName)) {
        const color = cityStatusColor(statsByName.get(row.srcName));
        pointByName.set(row.srcName, {
          label: row.srcName,
          lat: row.srcLat,
          lon: row.srcLon,
          ...(color !== undefined ? { color } : {}),
        });
      }
      if (!pointByName.has(row.dstName)) {
        const color = cityStatusColor(statsByName.get(row.dstName));
        pointByName.set(row.dstName, {
          label: row.dstName,
          lat: row.dstLat,
          lon: row.dstLon,
          ...(color !== undefined ? { color } : {}),
        });
      }
    }

    const edges = this.#rows.map((row) => {
      const percent = rttDeviationPercent(row);
      const color = isRttDeviationNotable(percent)
        ? rttColor(/** @type {number} */ (percent)).color
        : undefined;

      return {
        from: { label: row.srcName, lat: row.srcLat, lon: row.srcLon },
        to: { label: row.dstName, lat: row.dstLat, lon: row.dstLon },
        ...(color !== undefined ? { color } : {}),
      };
    });

    return {
      error: this.#error,
      refreshButton,
      geoMap: {
        points: [...pointByName.values()],
        edges,
      },
    };
  }
}

export { JcWorldMap };
