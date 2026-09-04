import {
  isArrayOf,
  isNonEmptyString,
  isNullable,
  isNumber,
  isRecord,
} from "@websense/util";

/**
 * @typedef {object} ApiCityPairMeasurement
 * @property {string} time
 * @property {number|null} rttMs
 * @property {number|null} packetLossPct
 */

/**
 * @param {unknown} value
 * @returns {ApiCityPairMeasurement|null}
 */
function sanitizeApiCityPairMeasurement(value) {
  if (!isRecord(value)) {
    return null;
  }
  const { time, rttMs, packetLossPct } = value;
  if (
    !isNonEmptyString(time) ||
    !isNullable(rttMs, isNumber) ||
    !isNullable(packetLossPct, isNumber)
  ) {
    return null;
  }
  return { time, rttMs, packetLossPct };
}

/**
 * @param {unknown} value
 * @returns {ApiCityPairMeasurement[]|null}
 */
function sanitizeApiCityPairMeasurements(value) {
  return isArrayOf(value, isApiCityPairMeasurement) ? value : null;
}

/**
 * @param {unknown} value
 * @returns {value is ApiCityPairMeasurement}
 */
function isApiCityPairMeasurement(value) {
  return sanitizeApiCityPairMeasurement(value) !== null;
}

export { sanitizeApiCityPairMeasurement, sanitizeApiCityPairMeasurements };
