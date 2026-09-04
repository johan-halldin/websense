import {
  isArrayOf,
  isBoolean,
  isNonEmptyString,
  isPositiveInteger,
  isRecord,
} from "@websense/util";

/**
 * @typedef {object} ApiCorrelation
 * @property {string} firstSrcName
 * @property {string} firstDstName
 * @property {string} secondSrcName
 * @property {string} secondDstName
 * @property {number} correlation
 * @property {number} sharedBuckets
 * @property {boolean} isSymmetric
 */

/**
 * @param {unknown} value
 * @returns {value is ApiCorrelation}
 */
function isApiCorrelation(value) {
  if (!isRecord(value)) {
    return false;
  }
  const {
    firstSrcName,
    firstDstName,
    secondSrcName,
    secondDstName,
    correlation,
    sharedBuckets,
    isSymmetric,
  } = value;
  if (
    !isNonEmptyString(firstSrcName) ||
    !isNonEmptyString(firstDstName) ||
    !isNonEmptyString(secondSrcName) ||
    !isNonEmptyString(secondDstName) ||
    !isCorrelation(correlation) ||
    !isPositiveInteger(sharedBuckets) ||
    !isBoolean(isSymmetric)
  ) {
    return false;
  }
  return true;
}

/**
 * @param {unknown} value
 * @returns {value is ApiCorrelation[]}
 */
function isApiCorrelations(value) {
  return isArrayOf(value, isApiCorrelation);
}

/**
 * @param {unknown} value
 * @returns {value is number}
 */
function isCorrelation(value) {
  return typeof value === "number" && value >= -1 && value <= 1;
}

export { isApiCorrelation, isApiCorrelations };
