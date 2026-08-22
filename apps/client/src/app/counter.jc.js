import { clamp } from "@websense/util";

/**
 * @typedef {import("./counter.wc.js").ICounter} ICounter
 */

const MIN = 0;
const MAX = 10;

class Counter {
  /** @type {number} */
  #count = 0;
  /** @type {() => void} */
  #on_change;

  /** @param {() => void} on_change */
  constructor(on_change) {
    this.#on_change = on_change;
  }

  /** @returns {ICounter} */
  getICounter() {
    return {
      count: this.#count,
      ...(this.#count < MAX ? { onIncrement: () => this.#increment() } : {}),
      ...(this.#count > MIN ? { onDecrement: () => this.#decrement() } : {}),
    };
  }

  #increment() {
    this.#count = clamp(this.#count + 1, MIN, MAX);
    this.#on_change();
  }

  #decrement() {
    this.#count = clamp(this.#count - 1, MIN, MAX);
    this.#on_change();
  }
}

export { Counter };
