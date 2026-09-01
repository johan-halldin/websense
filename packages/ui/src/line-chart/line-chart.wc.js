import {
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { css, html, LitElement } from "lit";

Chart.register(LineController, LineElement, PointElement, LinearScale, Tooltip);

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
 * @typedef {object} ILineChart
 * @property {string} [label] - series name, shown in the tooltip
 * @property {LineChartPoint[]} points
 */

/**
 * A minimal single-series time series line chart, backed by Chart.js.
 * Points are plotted by their actual timestamp on a linear x-axis (not one
 * category slot per point), so unevenly-spaced measurements - a gap from a
 * dropped ingest cycle, say - show up as a genuinely longer stretch of line
 * rather than being silently compressed to look evenly spaced.
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
    this.#chart.data.datasets = [
      {
        ...this.#chart.data.datasets[0],
        data: toChartPoints(ic.points),
        label: ic.label ?? "",
      },
    ];
    this.#chart.update();
  }

  /** @override */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.#chart?.destroy();
    this.#chart = null;
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
    const primaryColor = style.getPropertyValue("--color-primary").trim();
    const mutedColor = style.getPropertyValue("--color-text-muted").trim();
    const borderColor = style.getPropertyValue("--color-border").trim();

    return new Chart(canvas, {
      type: "line",
      data: {
        datasets: [
          {
            label: ic.label ?? "",
            data: toChartPoints(ic.points),
            borderColor: primaryColor,
            borderWidth: 2,
            borderCapStyle: "round",
            pointRadius: 0,
            tension: 0,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
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
 * @param {LineChartPoint[]} points
 * @returns {{x: number, y: number}[]}
 */
function toChartPoints(points) {
  return points.map((point) => ({
    x: new Date(point.time).getTime(),
    y: point.value,
  }));
}

customElements.define("ui-line-chart", UiLineChart);

export { UiLineChart };
