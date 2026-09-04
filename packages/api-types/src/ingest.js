import { isNonNegativeInteger, isRecord } from "@websense/util";

/**
 * @typedef {object} ApiIngest
 * @property {number} totalRows
 */

/**
 * @param {unknown} value
 * @returns {value is ApiIngest}
 */
function isApiIngest(value) {
  return isRecord(value) && isNonNegativeInteger(value.totalRows);
}

export { isApiIngest };
