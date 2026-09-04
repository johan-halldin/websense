/**
 * @template T
 * @typedef {
 *   | { type: "connection error", error: unknown }
 *   | { type: "HTTP NOT OK", status: number }
 *   | { type: "invalid response" }
 *   | { type: "HTTP OK", value: T }
 * } HttpValueResult
 */

/**
 * @template T
 * Fetches and parses a JSON HTTP response, validating a successful body.
 *
 * @param {string} input
 * @param {(value: unknown) => value is T} isValue
 * @param {RequestInit} [init]
 * @returns {Promise<HttpValueResult<T>>}
 */
async function fetchJson(input, isValue, init) {
  let response;
  try {
    response = await fetch(input, init);
  } catch (error) {
    return { type: "connection error", error };
  }
  if (!response.ok) {
    return { type: "HTTP NOT OK", status: response.status };
  }
  let value;
  try {
    value = await response.json();
  } catch {
    return { type: "invalid response" };
  }
  if (!isValue(value)) {
    console.error("Invalid HTTP response body");
    return { type: "invalid response" };
  }
  return { type: "HTTP OK", value };
}

/**
 * @template T
 * @param {HttpValueResult<T>} result
 * @returns {string}
 */
function httpResultErrorMessage(result) {
  if (result.type === "connection error") {
    return result.error instanceof Error
      ? result.error.message
      : String(result.error);
  }
  if (result.type === "HTTP NOT OK") {
    return `Request failed: ${result.status}`;
  }
  if (result.type === "invalid response") {
    return "Invalid server response";
  }
  return "";
}

export { fetchJson, httpResultErrorMessage };
