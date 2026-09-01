import {
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { css, html, LitElement } from "lit";

/** @import { ChartDataset } from "chart.js" */

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
);

/** Fixed categorical order, assigned by series position - never cycled or
 * picked by value. See tokens.css's --color-chart-* comment. */
const SERIES_COLOR_VARS = [
  "--color-chart-1",
  "--color-chart-2",
  "--color-chart-3",
  "--color-chart-4",
  "--color-chart-5",
  "--color-chart-6",
  "--color-chart-7",
  "--color-chart-8",
];

const tickFormat = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});
const tooltipTitleFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "medium",
});

/**
 * @typedef {object} LineChartPoint
 * @property {string} time - ISO 8601 timestamp
 * @property {number} value
 */

/**
 * @typedef {object} LineChartSeries
 * @property {string} label - series name, shown in the legend and tooltip
 * @property {LineChartPoint[]} points
 */

/**
 * @typedef {object} ILineChart
 * @property {LineChartSeries[]} series
 */

/**
 * A minimal multi-series time series line chart, backed by Chart.js. Points
 * are plotted by their actual timestamp on a linear x-axis (not one
 * category slot per point), so unevenly-spaced measurements - a gap from a
 * dropped ingest cycle, say - show up as a genuinely longer stretch of line
 * rather than being silently compressed to look evenly spaced.
 *
 * Each series is colored by its position in `series` against a fixed,
 * colorblind-safe categorical order (tokens.css's --color-chart-*) - never
 * cycled, never picked by value. A legend appears once there's more than
 * one series (a single series needs no legend - the surrounding UI names
 * it); the legend's own text stays in the muted ink token, only the swatch
 * carries the series color.
 *
 * Unlike every other component here, this one isn't purely declarative:
 * Chart.js owns an imperative `Chart` instance drawn onto a `<canvas>`, so
 * `render()` only ever returns that canvas once, and `updated()` mutates
 * the existing instance's data in place (`chart.update()`) rather than
 * recreating it - recreating on every `ic` change would drop Chart.js's
 * own transition animations and thrash the canvas context. The instance is
 * torn down in `disconnectedCallback()`, since Chart.js doesn't garbage
 * collect itself.
 */
class UiLineChart extends LitElement {
  /** @override */
  static styles = css`
    :host {
      display: block;
      position: relative;
      height: 240px;
    }
    canvas {
      width: 100% !important;
      height: 100% !important;
    }
  `;

  /** @type {ILineChart|null} */
  #ic = null;
  /** @type {Chart<"line", {x: number, y: number}[]>|null} */
  #chart = null;

  /** @param {ILineChart} ic */
  set ic(ic) {
    this.#ic = ic;
    this.requestUpdate();
  }

  /** @override */
  render() {
    return html`<canvas></canvas>`;
  }

  /** @override */
  updated() {
    const ic = this.#ic;
    if (ic === null) {
      return;
    }
    if (this.#chart === null) {
      this.#chart = this.#createChart(ic);
      return;
    }
    const seriesColors = this.#seriesColors();
    this.#chart.data.datasets = ic.series.map((series, i) =>
      toDataset(series, seriesColors[i % seriesColors.length] ?? ""),
    );
    const legend = this.#chart.options.plugins?.legend;
    if (legend !== undefined) {
      legend.display = ic.series.length >= 2;
    }
    this.#chart.update();
  }

  /** @override */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.#chart?.destroy();
    this.#chart = null;
  }

  /** @returns {string[]} */
  #seriesColors() {
    const style = getComputedStyle(this);
    return SERIES_COLOR_VARS.map((name) => style.getPropertyValue(name).trim());
  }

  /**
   * @param {ILineChart} ic
   * @returns {Chart<"line", {x: number, y: number}[]>}
   */
  #createChart(ic) {
    const canvas = /** @type {HTMLCanvasElement} */ (
      this.renderRoot.querySelector("canvas")
    );
    const style = getComputedStyle(this);
    const mutedColor = style.getPropertyValue("--color-text-muted").trim();
    const borderColor = style.getPropertyValue("--color-border").trim();
    const seriesColors = this.#seriesColors();

    return new Chart(canvas, {
      type: "line",
      data: {
        datasets: ic.series.map((series, i) =>
          toDataset(series, seriesColors[i % seriesColors.length] ?? ""),
        ),
      },
      options: {
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: ic.series.length >= 2,
            labels: { color: mutedColor },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              title: (items) => {
                const x = items[0]?.parsed.x;
                return x === undefined || x === null
                  ? ""
                  : tooltipTitleFormat.format(x);
              },
            },
          },
        },
        scales: {
          x: {
            type: "linear",
            grid: { color: borderColor },
            ticks: {
              color: mutedColor,
              callback: (value) => tickFormat.format(Number(value)),
            },
          },
          y: { grid: { color: borderColor }, ticks: { color: mutedColor } },
        },
      },
    });
  }
}

/**
 * @param {LineChartSeries} series
 * @param {string} color
 * @returns {ChartDataset<"line", {x: number, y: number}[]>}
 */
function toDataset(series, color) {
  return {
    label: series.label,
    data: series.points.map((point) => ({
      x: new Date(point.time).getTime(),
      y: point.value,
    })),
    borderColor: color,
    borderWidth: 2,
    borderCapStyle: "round",
    pointRadius: 0,
    tension: 0,
  };
}

customElements.define("ui-line-chart", UiLineChart);

export { UiLineChart };
