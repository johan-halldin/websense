import {
  isArrayOf,
  isNonEmptyString,
  isNumber,
  isPositiveInteger,
  isRecord,
} from "@websense/util";

/**
 * @typedef {object} ApiCity
 * @property {number} id
 * @property {string} name
 * @property {string} country
 * @property {number} lat
 * @property {number} lon
 * @property {number} probeId
 * @property {number} measurementId
 */

/**
 * @typedef {object} ApiCreateCity
 * @property {string} name
 * @property {string} country
 * @property {number} lat
 * @property {number} lon
 * @property {number} probeId
 * @property {number} measurementId
 */

/**
 * Returns a validated city-creation request, or null when the value does not
 * match the API contract.
 *
 * @param {unknown} value
 * @returns {ApiCreateCity|null}
 */
function sanitizeApiCreateCity(value) {
  if (!isRecord(value)) {
    return null;
  }
  const { name, country, lat, lon, probeId, measurementId } = value;
  if (
    !isNonEmptyString(name) ||
    !isNonEmptyString(country) ||
    !isLatitude(lat) ||
    !isLongitude(lon) ||
    !isPositiveInteger(probeId) ||
    !isPositiveInteger(measurementId)
  ) {
    return null;
  }
  return { name, country, lat, lon, probeId, measurementId };
}

/**
 * Returns a validated city response, or null when the value does not match
 * the API contract.
 *
 * @param {unknown} value
 * @returns {ApiCity|null}
 */
function sanitizeApiCity(value) {
  const city = sanitizeApiCreateCity(value);
  if (city === null || !isRecord(value) || !isPositiveInteger(value.id)) {
    return null;
  }
  return { id: value.id, ...city };
}

/**
 * Returns a validated city-list response, or null when any item does not
 * match the API contract.
 *
 * @param {unknown} value
 * @returns {ApiCity[]|null}
 */
function sanitizeApiCities(value) {
  return isArrayOf(value, isApiCity) ? value : null;
}

/**
 * @param {unknown} value
 * @returns {value is ApiCity}
 */
function isApiCity(value) {
  return sanitizeApiCity(value) !== null;
}

/**
 * @param {unknown} value
 * @returns {value is number}
 */
function isLatitude(value) {
  return isNumber(value) && value >= -90 && value <= 90;
}

/**
 * @param {unknown} value
 * @returns {value is number}
 */
function isLongitude(value) {
  return isNumber(value) && value >= -180 && value <= 180;
}

export { sanitizeApiCities, sanitizeApiCity, sanitizeApiCreateCity };
