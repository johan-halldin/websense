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
 * @param {unknown} value
 * @returns {value is ApiCity}
 */
function isApiCity(value) {
  if (!isRecord(value)) {
    return false;
  }
  const { id, name, country, lat, lon, probeId, measurementId } = value;
  return (
    isPositiveInteger(id) &&
    isNonEmptyString(name) &&
    isNonEmptyString(country) &&
    isLatitude(lat) &&
    isLongitude(lon) &&
    isPositiveInteger(probeId) &&
    isPositiveInteger(measurementId)
  );
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

export { isApiCities, isApiCity };
