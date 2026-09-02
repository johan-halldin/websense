import { css, html, LitElement, svg } from "lit";
import landJson from "./land-110m.json";

/**
 * @typedef {object} IGeoPoint
 * @property {string} label
 * @property {number} lat
 * @property {number} lon
 * @property {string} [color] - CSS color for the point fill, defaults to
 *   the primary color if omitted
 */

/**
 * @typedef {object} IGeoEdge
 * @property {IGeoPoint} from
 * @property {IGeoPoint} to
 * @property {string} [color] - CSS color for the line stroke, defaults to a
 *   neutral border color if omitted
 */

/**
 * @typedef {object} IGeoMap
 * @property {number} [width]
 * @property {number} [height]
 * @property {IGeoPoint[]} [points]
 * @property {IGeoEdge[]} [edges]
 */

/**
 * @typedef {[number, number]} Position
 * @typedef {object} PolygonGeometry
 * @property {"Polygon"} type
 * @property {Position[][]} coordinates
 * @typedef {object} MultiPolygonGeometry
 * @property {"MultiPolygon"} type
 * @property {Position[][][]} coordinates
 * @typedef {PolygonGeometry|MultiPolygonGeometry} LandGeometry
 */

const land = /** @type {{features: {geometry: LandGeometry}[]}} */ (
  /** @type {unknown} */ (landJson)
);

const DEFAULT_WIDTH = 960;
/** Equirectangular projection is 2:1 (360deg of longitude over 180deg of
 * latitude), so height defaults to half the width. */
const DEFAULT_HEIGHT = DEFAULT_WIDTH / 2;

/**
 * @param {Position} position
 * @param {number} width
 * @param {number} height
 * @returns {Position}
 */
function project([lon, lat], width, height) {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return [x, y];
}

/**
 * @param {Position[]} ring
 * @param {number} width
 * @param {number} height
 * @returns {string}
 */
function ringToPath(ring, width, height) {
  const points = ring.map((position) => {
    const [x, y] = project(position, width, height);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  return `M${points.join("L")}Z`;
}

/**
 * @param {Position[][]} rings
 * @param {number} width
 * @param {number} height
 * @returns {string}
 */
function polygonToPath(rings, width, height) {
  return rings.map((ring) => ringToPath(ring, width, height)).join(" ");
}

/**
 * @param {number} width
 * @param {number} height
 * @returns {string} a single SVG path `d` covering every land feature
 */
function buildLandPath(width, height) {
  return land.features
    .map((feature) => {
      const geometry = feature.geometry;
      if (geometry.type === "Polygon") {
        return polygonToPath(geometry.coordinates, width, height);
      }
      return geometry.coordinates
        .map((polygon) => polygonToPath(polygon, width, height))
        .join(" ");
    })
    .join(" ");
}

class UiGeoMap extends LitElement {
  /** @override */
  static styles = css`
    :host {
      display: block;
    }
    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
    .land {
      fill: var(--color-gray-200);
      stroke: var(--color-gray-300);
      stroke-width: 0.5;
    }
    .edge {
      stroke-width: 1.5;
      stroke-linecap: round;
    }
    .point {
      fill: var(--color-primary);
      stroke: var(--color-surface);
      stroke-width: 1;
    }
    .label {
      font-size: 9px;
      fill: var(--color-text);
    }
  `;

  /** @type {IGeoMap|null} */
  #ic = null;

  /** @param {IGeoMap} ic */
  set ic(ic) {
    this.#ic = ic;
    this.requestUpdate();
  }

  /** @override */
  render() {
    const width = this.#ic?.width ?? DEFAULT_WIDTH;
    const height = this.#ic?.height ?? DEFAULT_HEIGHT;
    const points = this.#ic?.points ?? [];
    const edges = this.#ic?.edges ?? [];

    return html`
      <svg viewBox="0 0 ${width} ${height}">
        <path
          class="land"
          fill-rule="evenodd"
          d=${buildLandPath(width, height)}
        ></path>
        ${edges.map((edge) => {
          const [x1, y1] = project(
            [edge.from.lon, edge.from.lat],
            width,
            height,
          );
          const [x2, y2] = project([edge.to.lon, edge.to.lat], width, height);
          return svg`
            <line
              class="edge"
              x1=${x1}
              y1=${y1}
              x2=${x2}
              y2=${y2}
              stroke=${edge.color ?? "var(--color-border)"}
            ></line>
          `;
        })}
        ${points.map((point) => {
          const [x, y] = project([point.lon, point.lat], width, height);
          return svg`
            <circle
              class="point"
              cx=${x}
              cy=${y}
              r="3"
              style=${point.color !== undefined ? `fill: ${point.color};` : ""}
            ></circle>
            <text class="label" x=${x + 5} y=${y + 3}>${point.label}</text>
          `;
        })}
      </svg>
    `;
  }
}

customElements.define("ui-geo-map", UiGeoMap);

export { UiGeoMap };
