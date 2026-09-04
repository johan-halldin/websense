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
 * @returns {value is ApiMeshRow}
 */
function isApiMeshRow(value) {
  if (!isRecord(value)) {
    return false;
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
    return false;
  }
  return true;
}

/**
 * @param {unknown} value
 * @returns {value is ApiMeshRow[]}
 */
function isApiMeshRows(value) {
  return isArrayOf(value, isApiMeshRow);
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

export { isApiMeshRow, isApiMeshRows };
