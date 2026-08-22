import { css, html, LitElement } from "lit";

/**
 * @typedef {object} ILineChart
 * @property {{x: number, y: number}[]} points
 * @property {number} [width]
 * @property {number} [height]
 */

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 200;

export class UiLineChart extends LitElement {
  /** @override */
  static styles = css`
    svg {
      display: block;
      width: 100%;
      height: auto;
    }
    polyline {
      fill: none;
      stroke: var(--color-primary);
      stroke-width: 2;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
  `;

  /** @type {ILineChart|null} */
  #ic = null;

  /** @param {ILineChart} ic */
  set ic(ic) {
    this.#ic = ic;
    this.requestUpdate();
  }

  /** @override */
  render() {
    const ic = this.#ic;
    if (ic === null || ic.points.length === 0) {
      return "";
    }

    const width = ic.width ?? DEFAULT_WIDTH;
    const height = ic.height ?? DEFAULT_HEIGHT;
    const xs = ic.points.map((point) => point.x);
    const ys = ic.points.map((point) => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;

    const svgPoints = ic.points
      .map((point) => {
        const px = ((point.x - minX) / spanX) * width;
        const py = height - ((point.y - minY) / spanY) * height;
        return `${px},${py}`;
      })
      .join(" ");

    return html`
      <svg viewBox="0 0 ${width} ${height}">
        <polyline points=${svgPoints}></polyline>
      </svg>
    `;
  }
}

customElements.define("ui-line-chart", UiLineChart);
