/**
 * Returns whether a value is a boolean.
 *
 * @param {unknown} v
 * @returns {v is boolean}
 */
function isBoolean(v) {
  return typeof v === "boolean";
}

/**
 * Returns whether a value is null.
 *
 * @param {unknown} v
 * @returns {v is null}
 */
function isNull(v) {
  return v === null;
}

/**
 * Returns whether a value is undefined.
 *
 * @param {unknown} v
 * @returns {v is undefined}
 */
function isUndefined(v) {
  return v === undefined;
}

/**
 * Returns whether a value is a string.
 *
 * @param {unknown} v
 * @returns {v is string}
 */
function isString(v) {
  return typeof v === "string";
}

/**
 * Returns whether a value is a non-empty string.
 *
 * @param {unknown} v
 * @returns {v is string}
 */
function isNonEmptyString(v) {
  return isString(v) && v.trim().length > 0;
}

/**
 * Returns whether a value is a finite number.
 *
 * @param {unknown} v
 * @returns {v is number}
 */
function isNumber(v) {
  return typeof v === "number" && Number.isFinite(v);
}

/**
 * Returns whether a value is an integer.
 *
 * @param {unknown} v
 * @returns {v is number}
 */
function isInteger(v) {
  return Number.isInteger(v);
}

/**
 * Returns whether a value is a positive integer.
 *
 * @param {unknown} v
 * @returns {v is number}
 */
function isPositiveInteger(v) {
  return isInteger(v) && v > 0;
}

/**
 * Returns whether a value is a negative integer.
 *
 * @param {unknown} v
 * @returns {v is number}
 */
function isNegativeInteger(v) {
  return isInteger(v) && v < 0;
}

/**
 * Returns whether a value is a non-negative integer.
 *
 * @param {unknown} v
 * @returns {v is number}
 */
function isNonNegativeInteger(v) {
  return isInteger(v) && v >= 0;
}

/**
 * Returns whether a value is an array.
 *
 * @param {unknown} v
 * @returns {v is unknown[]}
 */
function isArray(v) {
  return Array.isArray(v);
}

/**
 * Returns whether every item in an array satisfies a guard.
 *
 * @template T
 * @param {unknown} v
 * @param {(element: unknown) => element is T} isElement
 * @returns {v is T[]}
 */
function isArrayOf(v, isElement) {
  return isArray(v) && v.every((element) => isElement(element));
}

/**
 * Returns whether a value is a plain record, excluding arrays, null, and
 * class instances.
 *
 * @param {unknown} v
 * @returns {v is Record<string, unknown>}
 */
function isRecord(v) {
  if (typeof v !== "object" || v === null || Array.isArray(v)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(v);
  return prototype === Object.prototype || prototype === null;
}

/**
 * Returns whether every value in a record satisfies a guard.
 *
 * @template T
 * @param {unknown} v
 * @param {(value: unknown) => value is T} isValue
 * @returns {v is Record<string, T>}
 */
function isRecordOf(v, isValue) {
  return isRecord(v) && Object.values(v).every((value) => isValue(value));
}

/**
 * Returns whether a value is undefined or satisfies a guard.
 *
 * @template T
 * @param {unknown} v
 * @param {(value: unknown) => value is T} isValue
 * @returns {v is T|undefined}
 */
function isOptional(v, isValue) {
  return isUndefined(v) || isValue(v);
}

/**
 * Returns whether a value is null or satisfies a guard.
 *
 * @template T
 * @param {unknown} v
 * @param {(value: unknown) => value is T} isValue
 * @returns {v is T|null}
 */
function isNullable(v, isValue) {
  return isNull(v) || isValue(v);
}

/**
 * Returns whether a value is one of a set of literal values.
 *
 * @template T
 * @param {unknown} v
 * @param {readonly T[]} values
 * @returns {v is T}
 */
function isOneOf(v, values) {
  return values.some((value) => value === v);
}

export {
  isArray,
  isArrayOf,
  isBoolean,
  isInteger,
  isNegativeInteger,
  isNonEmptyString,
  isNonNegativeInteger,
  isNull,
  isNullable,
  isNumber,
  isOneOf,
  isOptional,
  isPositiveInteger,
  isRecord,
  isRecordOf,
  isString,
  isUndefined,
};
