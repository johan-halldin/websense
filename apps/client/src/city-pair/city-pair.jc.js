/** @import { ICityPair } from "./city-pair.wc.js" */

/**
 * @typedef {object} City
 * @property {string} id
 * @property {string} name
 */

/** @type {City[]} */
const CITIES = [
  { id: "nyc", name: "New York" },
  { id: "lon", name: "London" },
  { id: "tok", name: "Tokyo" },
  { id: "ber", name: "Berlin" },
  { id: "syd", name: "Sydney" },
  { id: "sao", name: "São Paulo" },
  { id: "sin", name: "Singapore" },
  { id: "jnb", name: "Johannesburg" },
];

/**
 * @typedef {object} CityPairMeasurement
 * @property {string} time
 * @property {number} rttMs
 * @property {number} packetLossPct
 */

/**
 * A tiny seeded PRNG so a given city pair's fake measurements look stable
 * across re-renders instead of jittering randomly every time.
 *
 * @param {string} seed
 * @returns {() => number}
 */
function makeRng(seed) {
  let state = 0;
  for (const char of seed) {
    state = (state * 31 + char.charCodeAt(0)) | 0;
  }
  return () => {
    state = (state * 1103515245 + 12345) | 0;
    return ((state >>> 0) % 1000) / 1000;
  };
}

/**
 * @param {string} srcId
 * @param {string} dstId
 * @returns {CityPairMeasurement[]}
 */
function fakeMeasurements(srcId, dstId) {
  const rng = makeRng(`${srcId}-${dstId}`);
  const baseRttMs = 20 + rng() * 180;
  const count = 12;
  const now = Date.now();

  return Array.from({ length: count }, (_, i) => {
    const time = new Date(now - (count - 1 - i) * 5 * 60 * 1000).toISOString();
    const rttMs = Math.max(1, baseRttMs + (rng() - 0.5) * 20);
    const packetLossPct = rng() < 0.1 ? Math.round(rng() * 20) : 0;
    return {
      time,
      rttMs: Math.round(rttMs * 10) / 10,
      packetLossPct,
    };
  });
}

class JcCityPair {
  /** @type {() => void} */
  #on_change;
  /** @type {string|null} */
  #srcId = null;
  /** @type {string|null} */
  #dstId = null;

  /** @param {() => void} on_change */
  constructor(on_change) {
    this.#on_change = on_change;
  }

  /** @returns {ICityPair} */
  getICityPair() {
    const srcId = this.#srcId;
    const dstId = this.#dstId;
    const options = CITIES.map((city) => ({
      value: city.id,
      label: city.name,
    }));

    return {
      srcSelect: {
        label: "From",
        options,
        selectedValues: srcId !== null ? [srcId] : [],
        onSelect: (value) => {
          this.#srcId = value;
          this.#on_change();
        },
      },
      dstSelect: {
        label: "To",
        options,
        selectedValues: dstId !== null ? [dstId] : [],
        onSelect: (value) => {
          this.#dstId = value;
          this.#on_change();
        },
      },
      rows:
        srcId !== null && dstId !== null ? fakeMeasurements(srcId, dstId) : [],
    };
  }
}

export { JcCityPair };
