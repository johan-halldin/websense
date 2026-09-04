import {
  isArrayOf,
  isNonEmptyString,
  isNullable,
  isNumber,
  isOneOf,
  isRecord,
} from "@websense/util";

/**
 * @typedef {object} ApiCityPairMeasurement
 * @property {string} time
 * @property {number|null} rttMs
 * @property {number|null} packetLossPct
 */

/** @typedef {"day"|"week"|"month"|"year"} ApiCityPairRange */
/** @typedef {"none"|"hour"|"day"} ApiCityPairGrouping */

/** @type {readonly ApiCityPairRange[]} */
const CITY_PAIR_RANGES = ["day", "week", "month", "year"];
/** @type {readonly ApiCityPairGrouping[]} */
const CITY_PAIR_GROUPINGS = ["none", "hour", "day"];

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

/**
 * @param {unknown} value
 * @returns {value is ApiCityPairRange}
 */
function isApiCityPairRange(value) {
  return isOneOf(value, CITY_PAIR_RANGES);
}

/**
 * @param {unknown} value
 * @returns {value is ApiCityPairGrouping}
 */
function isApiCityPairGrouping(value) {
  return isOneOf(value, CITY_PAIR_GROUPINGS);
}

export {
  isApiCityPairGrouping,
  isApiCityPairMeasurement,
  isApiCityPairMeasurements,
  isApiCityPairRange,
};
