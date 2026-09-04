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
 * @returns {ApiCorrelation|null}
 */
function sanitizeApiCorrelation(value) {
  if (!isRecord(value)) {
    return null;
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
    return null;
  }
  return {
    firstSrcName,
    firstDstName,
    secondSrcName,
    secondDstName,
    correlation,
    sharedBuckets,
    isSymmetric,
  };
}

/**
 * @param {unknown} value
 * @returns {ApiCorrelation[]|null}
 */
function sanitizeApiCorrelations(value) {
  return isArrayOf(value, isApiCorrelation) ? value : null;
}

/**
 * @param {unknown} value
 * @returns {value is ApiCorrelation}
 */
function isApiCorrelation(value) {
  return sanitizeApiCorrelation(value) !== null;
}

/**
 * @param {unknown} value
 * @returns {value is number}
 */
function isCorrelation(value) {
  return typeof value === "number" && value >= -1 && value <= 1;
}

export { sanitizeApiCorrelation, sanitizeApiCorrelations };
