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
 * @returns {value is ApiCityPairMeasurement}
 */
function isApiCityPairMeasurement(value) {
  if (!isRecord(value)) {
    return false;
  }
  const { time, rttMs, packetLossPct } = value;
  if (
    !isNonEmptyString(time) ||
    !isNullable(rttMs, isNumber) ||
    !isNullable(packetLossPct, isNumber)
  ) {
    return false;
  }
  return true;
}

/**
 * @param {unknown} value
 * @returns {value is ApiCityPairMeasurement[]}
 */
function isApiCityPairMeasurements(value) {
  return isArrayOf(value, isApiCityPairMeasurement);
}

export { isApiCityPairMeasurement, isApiCityPairMeasurements };
