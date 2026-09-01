/**
 * Uppercases the first letter of a string.
 *
 * @param {string} value
 * @returns {string}
 */
function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export { capitalize };
