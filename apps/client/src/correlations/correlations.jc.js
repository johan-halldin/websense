import { with_blocking_spinner } from "@websense/ui/src/spinner/blocking-spinner.js";
import { fetchCorrelations } from "../fetch/correlations.js";

/** @import { ICorrelations } from "./correlations.wc.js" */
/** @import { IButton } from "@websense/ui/src/button/button.wc.js" */
/** @import { ISegmentedControl } from "@websense/ui/src/segmented-control/segmented-control.wc.js" */
/** @import { ApiCorrelation } from "@websense/api-types" */
/** @import { CorrelationGrouping, CorrelationRange } from "../fetch/correlations.js" */

class JcCorrelations {
  /** @type {() => void} */
  #on_change;
  /** @type {CorrelationRange} */
  #range = "week";
  /** @type {CorrelationGrouping} */
  #grouping = "hour";
  /** @type {ApiCorrelation[]} */
  #rows = [];
  /** @type {string|null} */
  #error = null;

  /** @param {() => void} on_change */
  constructor(on_change) {
    this.#on_change = on_change;
    this.#fetch();
  }

  async #fetch() {
    await with_blocking_spinner(this.#doFetch(), "Calculating correlations...");
    this.#on_change();
  }

  async #doFetch() {
    try {
      this.#rows = await fetchCorrelations(this.#range, this.#grouping);
      this.#error = null;
    } catch (error) {
      this.#error = error instanceof Error ? error.message : String(error);
    }
  }

  /** Silently re-fetches after the server signals new measurements. */
  async refreshFromServerChange() {
    await this.#doFetch();
    this.#on_change();
  }

  /** @param {CorrelationRange} range */
  #setRange(range) {
    this.#range = range;
    this.#fetch();
  }

  /** @param {CorrelationGrouping} grouping */
  #setGrouping(grouping) {
    this.#grouping = grouping;
    this.#fetch();
  }

  /** @returns {ICorrelations} */
  getICorrelations() {
    /** @type {IButton} */
    const refreshButton = {
      label: "Refresh",
      icon: "refresh-cw",
      onClick: () => this.#fetch(),
    };

    /** @type {ISegmentedControl} */
    const rangeControl = {
      value: this.#range,
      options: [
        { value: "week", label: "1 week" },
        { value: "month", label: "1 month" },
        { value: "year", label: "1 year" },
      ],
      onChange: (value) => {
        if (value === "week" || value === "month" || value === "year") {
          this.#setRange(value);
        }
      },
    };

    /** @type {ISegmentedControl} */
    const groupingControl = {
      value: this.#grouping,
      options: [
        { value: "hour", label: "1 hour" },
        { value: "day", label: "1 day" },
      ],
      onChange: (value) => {
        if (value === "hour" || value === "day") {
          this.#setGrouping(value);
        }
      },
    };

    return {
      refreshButton,
      rangeControl,
      groupingControl,
      symmetricRows: this.#rows.filter((row) => row.isSymmetric),
      otherRows: this.#rows.filter((row) => !row.isSymmetric),
      error: this.#error,
    };
  }
}

export { JcCorrelations };
