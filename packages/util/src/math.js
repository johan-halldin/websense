/**
 * Restricts a number to a range.
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Returns a random integer from zero (inclusive) to length (exclusive).
 *
 * @param {number} length - a positive integer
 * @returns {number}
 */
function randomIndex(length) {
  console.assert(
    Number.isInteger(length) && length > 0,
    "randomIndex length must be a positive integer",
  );
  return Math.floor(Math.random() * length);
}

export { clamp, randomIndex };
