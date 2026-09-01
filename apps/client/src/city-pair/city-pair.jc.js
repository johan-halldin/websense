import { with_blocking_spinner } from "@websense/ui/src/spinner/blocking-spinner.js";
import { show_toast } from "@websense/ui/src/toast/toast.js";
import { formatTime } from "@websense/util";
import { subscribeToPingResultsUpdates } from "../ping-results-events.js";

/** @import { ICityPair } from "./city-pair.wc.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */

/**
 * @typedef {object} City
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {object} CityPairMeasurement
 * @property {string} time
 * @property {number|null} rttMs
 * @property {number|null} packetLossPct
 */

class JcCityPair {
  /** @type {() => void} */
  #on_change;
  /** @type {City[]} */
  #cities = [];
  /** @type {number|null} */
  #srcId = null;
  /** @type {number|null} */
  #dstId = null;
  /** @type {CityPairMeasurement[]} */
  #rows = [];
  /** @type {string|null} */
  #error = null;

  /** @param {() => void} on_change */
  constructor(on_change) {
    this.#on_change = on_change;
    this.#fetchCities();
    this.#subscribeToUpdates();
  }

  /** Silently re-fetches (no blocking spinner) whenever the server pushes a
   * notification that new ping results landed - only if a pair is already
   * being viewed, so this never overrides the "Fetch measurements" button's
   * manual-trigger intent by starting a fetch nobody asked for. */
  #subscribeToUpdates() {
    subscribeToPingResultsUpdates(() => {
      if (
        this.#srcId === null ||
        this.#dstId === null ||
        this.#rows.length === 0
      ) {
        return;
      }
      this.#doFetchMeasurements().then(() => {
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
      const response = await fetch("/api/cities");
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      this.#cities = await response.json();
      this.#error = null;
    } catch (error) {
      this.#error = error instanceof Error ? error.message : String(error);
    }
  }

  async #fetchMeasurements() {
    await with_blocking_spinner(
      this.#doFetchMeasurements(),
      "Loading measurements...",
    );
    this.#on_change();
  }

  async #doFetchMeasurements() {
    const srcId = this.#srcId;
    const dstId = this.#dstId;
    if (srcId === null || dstId === null) {
      return;
    }
    try {
      const response = await fetch(`/api/city-pair?src=${srcId}&dst=${dstId}`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      this.#rows = await response.json();
      this.#error = null;
    } catch (error) {
      this.#error = error instanceof Error ? error.message : String(error);
    }
  }

  /** @returns {ICityPair} */
  getICityPair() {
    const options = this.#cities.map((city) => ({
      value: String(city.id),
      label: city.name,
    }));
    const canFetch = this.#srcId !== null && this.#dstId !== null;

    /** @type {IButton} */
    const fetchButton = {
      label: "Fetch measurements",
      icon: "search",
      ...(canFetch ? { onClick: () => this.#fetchMeasurements() } : {}),
    };

    return {
      srcSelect: {
        label: "From",
        options,
        selectedValues: this.#srcId !== null ? [String(this.#srcId)] : [],
        onSelect: (value) => {
          this.#srcId = Number(value);
          this.#rows = [];
          this.#on_change();
        },
      },
      dstSelect: {
        label: "To",
        options,
        selectedValues: this.#dstId !== null ? [String(this.#dstId)] : [],
        onSelect: (value) => {
          this.#dstId = Number(value);
          this.#rows = [];
          this.#on_change();
        },
      },
      fetchButton,
      error: this.#error,
      rows: this.#rows,
    };
  }
}

export { JcCityPair };
