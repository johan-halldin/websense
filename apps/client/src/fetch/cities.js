/**
 * @typedef {object} City
 * @property {number} id
 * @property {string} name
 */

/**
 * Fetches every configured city from the server (GET /api/cities).
 *
 * @returns {Promise<City[]>}
 */
async function fetchCities() {
  const response = await fetch("/api/cities");
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export { fetchCities };
