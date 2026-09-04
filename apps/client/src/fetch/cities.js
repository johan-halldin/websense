import { sanitizeApiCities } from "@websense/api-types";

/** @import { ApiCity } from "@websense/api-types" */

/**
 * Fetches every configured city from the server (GET /api/cities).
 *
 * @returns {Promise<ApiCity[]>}
 */
async function fetchCities() {
  const response = await fetch("/api/cities");
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const cities = sanitizeApiCities(await response.json());
  if (cities === null) {
    throw new Error("Invalid city response");
  }
  return cities;
}

export { fetchCities };
