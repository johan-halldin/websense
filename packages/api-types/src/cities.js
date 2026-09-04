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
 * @param {unknown} value
 * @returns {value is ApiCreateCity}
 */
function isApiCreateCity(value) {
  if (!isRecord(value)) {
    return false;
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
    return false;
  }
  return true;
}

/**
 * @param {unknown} value
 * @returns {value is ApiCity}
 */
function isApiCity(value) {
  if (!isRecord(value)) {
    return false;
  }
  const id = value.id;
  return isApiCreateCity(value) && isPositiveInteger(id);
}

/**
 * @param {unknown} value
 * @returns {value is ApiCity[]}
 */
function isApiCities(value) {
  return isArrayOf(value, isApiCity);
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

export { isApiCities, isApiCity, isApiCreateCity };
