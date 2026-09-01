import { with_blocking_spinner } from "@websense/ui/src/spinner/blocking-spinner.js";
import { show_toast } from "@websense/ui/src/toast/toast.js";
import { formatTime } from "@websense/util";
import { fetchCities } from "../fetch/cities.js";
import { fetchCityPairMeasurements } from "../fetch/city-pair.js";
import { subscribeToPingResultsUpdates } from "../fetch/ping-result-events.js";

/** @import { ICityPair, ICityPairRow } from "./city-pair.wc.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */
/** @import { ILineChart } from "@websense/ui/src/line-chart/line-chart.wc.js" */
/** @import { City } from "../fetch/cities.js" */
/** @import { CityPairMeasurement } from "../fetch/city-pair.js" */

/**
 * @typedef {object} Pair
 * @property {string} id
 * @property {number|null} srcId
 * @property {number|null} dstId
 * @property {CityPairMeasurement[]} rows
 */

class JcCityPair {
  /** @type {() => void} */
  #on_change;
  /** @type {City[]} */
  #cities = [];
  /** @type {Pair[]} */
  #pairs = [{ id: crypto.randomUUID(), srcId: null, dstId: null, rows: [] }];
  /** @type {string|null} */
  #error = null;

  /** @param {() => void} on_change */
  constructor(on_change) {
    this.#on_change = on_change;
    this.#startup();
    this.#subscribeToUpdates();
  }

  /** Fetches cities first, defaults the first pair to the first/last city
   * once the list actually comes back, then fetches its measurements. */
  async #startup() {
    await this.#fetchCities();
    const firstPair = this.#pairs[0];
    if (firstPair !== undefined) {
      firstPair.srcId = this.#cities.at(0)?.id ?? null;
      firstPair.dstId = this.#cities.at(-1)?.id ?? null;
    }
    await this.#fetchAllMeasurements();
  }

  /** Silently re-fetches (no blocking spinner) whenever the server pushes a
   * notification that new ping results landed - only if some pair is
   * already being viewed, so this never overrides the "Refresh" button's
   * manual-trigger intent by starting a fetch nobody asked for. */
  #subscribeToUpdates() {
    subscribeToPingResultsUpdates(() => {
      const hasData = this.#pairs.some((pair) => pair.rows.length > 0);
      if (!hasData) {
        return;
      }
      this.#doFetchAllMeasurements().then(() => {
        this.#on_change();
        show_toast(`Page updated at ${formatTime(new Date())}`, {
          level: "info",
        });
      });
    });
  }

  async #fetchCities() {
    await with_blocking_spinner(this.#doFetchCities(), "Loading cities...");
    this.#on_change();
  }

  async #doFetchCities() {
    try {
      this.#cities = await fetchCities();
      this.#error = null;
    } catch (error) {
      this.#error = error instanceof Error ? error.message : String(error);
    }
  }

  async #fetchAllMeasurements() {
    await with_blocking_spinner(
      this.#doFetchAllMeasurements(),
      "Loading measurements...",
    );
    this.#on_change();
  }

  async #doFetchAllMeasurements() {
    await Promise.all(
      this.#pairs
        .filter((pair) => pair.srcId !== null && pair.dstId !== null)
        .map((pair) => this.#doFetchPairMeasurements(pair)),
    );
  }

  /** @param {Pair} pair */
  async #doFetchPairMeasurements(pair) {
    const srcId = pair.srcId;
    const dstId = pair.dstId;
    if (srcId === null || dstId === null) {
      return;
    }
    try {
      pair.rows = await fetchCityPairMeasurements(srcId, dstId);
      this.#error = null;
    } catch (error) {
      this.#error = error instanceof Error ? error.message : String(error);
    }
  }

  #addPair() {
    this.#pairs = [
      ...this.#pairs,
      { id: crypto.randomUUID(), srcId: null, dstId: null, rows: [] },
    ];
    this.#on_change();
  }

  /** @param {string} id */
  #removePair(id) {
    this.#pairs = this.#pairs.filter((pair) => pair.id !== id);
    this.#on_change();
  }

  /** @param {number|null} id */
  #cityName(id) {
    return this.#cities.find((city) => city.id === id)?.name ?? "?";
  }

  /** @returns {ICityPair} */
  getICityPair() {
    const options = this.#cities.map((city) => ({
      value: String(city.id),
      label: city.name,
    }));

    /** @type {IButton} */
    const refreshButton = {
      label: "Refresh",
      icon: "refresh-cw",
      onClick: () => this.#fetchAllMeasurements(),
    };

    /** @type {IButton} */
    const addPairButton = {
      label: "Add pair",
      icon: "plus",
      onClick: () => this.#addPair(),
    };

    /** @type {ICityPairRow[]} */
    const pairs = this.#pairs.map((pair) => ({
      id: pair.id,
      srcSelect: {
        label: "From",
        options,
        selectedValues: pair.srcId !== null ? [String(pair.srcId)] : [],
        onSelect: (value) => {
          pair.srcId = Number(value);
          pair.rows = [];
          this.#on_change();
        },
      },
      dstSelect: {
        label: "To",
        options,
        selectedValues: pair.dstId !== null ? [String(pair.dstId)] : [],
        onSelect: (value) => {
          pair.dstId = Number(value);
          pair.rows = [];
          this.#on_change();
        },
      },
      removeButton: {
        icon: "trash-2",
        tooltip: "Remove pair",
        onClick: () => this.#removePair(pair.id),
      },
      rows: pair.rows,
    }));

    /** @type {ILineChart} */
    const chart = {
      series: this.#pairs
        .filter((pair) => pair.rows.length > 0)
        .map((pair) => ({
          label: `${this.#cityName(pair.srcId)} → ${this.#cityName(pair.dstId)}`,
          points: pair.rows
            .filter((row) => row.rttMs !== null)
            .map((row) => ({
              time: row.time,
              value: /** @type {number} */ (row.rttMs),
            }))
            .sort(
              (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
            ),
        })),
    };

    return {
      refreshButton,
      addPairButton,
      pairs,
      error: this.#error,
      chart,
    };
  }
}

export { JcCityPair };
