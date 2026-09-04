import {
  isArrayOf,
  isNonEmptyString,
  isNullable,
  isNumber,
  isRecord,
} from "@websense/util";

/**
 * @typedef {object} ApiMeshRow
 * @property {string} srcName
 * @property {number} srcLat
 * @property {number} srcLon
 * @property {string} dstName
 * @property {number} dstLat
 * @property {number} dstLon
 * @property {string} time
 * @property {number|null} rttAvgMs
 * @property {number|null} packetLossPct
 * @property {number|null} avgRttMs
 * @property {number|null} avgPacketLossPct
 */

/**
 * @param {unknown} value
 * @returns {ApiMeshRow|null}
 */
function sanitizeApiMeshRow(value) {
  if (!isRecord(value)) {
    return null;
  }
  const {
    srcName,
    srcLat,
    srcLon,
    dstName,
    dstLat,
    dstLon,
    time,
    rttAvgMs,
    packetLossPct,
    avgRttMs,
    avgPacketLossPct,
  } = value;
  if (
    !isNonEmptyString(srcName) ||
    !isLatitude(srcLat) ||
    !isLongitude(srcLon) ||
    !isNonEmptyString(dstName) ||
    !isLatitude(dstLat) ||
    !isLongitude(dstLon) ||
    !isNonEmptyString(time) ||
    !isNullable(rttAvgMs, isNumber) ||
    !isNullable(packetLossPct, isNumber) ||
    !isNullable(avgRttMs, isNumber) ||
    !isNullable(avgPacketLossPct, isNumber)
  ) {
    return null;
  }
  return {
    srcName,
    srcLat,
    srcLon,
    dstName,
    dstLat,
    dstLon,
    time,
    rttAvgMs,
    packetLossPct,
    avgRttMs,
    avgPacketLossPct,
  };
}

/**
 * @param {unknown} value
 * @returns {ApiMeshRow[]|null}
 */
function sanitizeApiMeshRows(value) {
  return isArrayOf(value, isApiMeshRow) ? value : null;
}

/**
 * @param {unknown} value
 * @returns {value is ApiMeshRow}
 */
function isApiMeshRow(value) {
  return sanitizeApiMeshRow(value) !== null;
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

export { sanitizeApiMeshRow, sanitizeApiMeshRows };
