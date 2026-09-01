import {
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { css, html, LitElement } from "lit";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
);

/**
 * @typedef {object} LineChartPoint
 * @property {string} label
 * @property {number} value
 */

/**
 * @typedef {object} ILineChart
 * @property {string} [label] - series name, shown in the tooltip
 * @property {LineChartPoint[]} points
 */

/**
 * A minimal single-series time series line chart, backed by Chart.js.
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
  /** @type {Chart<"line", number[], string>|null} */
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
    this.#chart.data.labels = ic.points.map((point) => point.label);
    this.#chart.data.datasets = [
      {
        ...this.#chart.data.datasets[0],
        data: ic.points.map((point) => point.value),
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
   * @returns {Chart<"line", number[], string>}
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
        labels: ic.points.map((point) => point.label),
        datasets: [
          {
            label: ic.label ?? "",
            data: ic.points.map((point) => point.value),
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
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          x: { grid: { color: borderColor }, ticks: { color: mutedColor } },
          y: { grid: { color: borderColor }, ticks: { color: mutedColor } },
        },
      },
    });
  }
}

customElements.define("ui-line-chart", UiLineChart);

export { UiLineChart };
