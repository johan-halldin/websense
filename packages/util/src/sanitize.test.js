import { describe, expect, it } from "vitest";
import {
  isArray,
  isArrayOf,
  isBoolean,
  isInteger,
  isNonEmptyString,
  isNull,
  isNullable,
  isNumber,
  isOneOf,
  isOptional,
  isRecord,
  isRecordOf,
  isString,
  isUndefined,
} from "./sanitize.js";

describe("sanitize guards", () => {
  it("identifies primitive values", () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean("true")).toBe(false);
    expect(isString("WebSense")).toBe(true);
    expect(isString(42)).toBe(false);
  });

  it("identifies null and undefined", () => {
    expect(isNull(null)).toBe(true);
    expect(isNull(undefined)).toBe(false);
    expect(isUndefined(undefined)).toBe(true);
    expect(isUndefined(null)).toBe(false);
  });

  it("identifies non-empty strings without coercing values", () => {
    expect(isNonEmptyString("WebSense")).toBe(true);
    expect(isNonEmptyString("")).toBe(false);
    expect(isNonEmptyString("  \t\n  ")).toBe(false);
    expect(isNonEmptyString(1)).toBe(false);
  });

  it("accepts finite numbers and identifies integers", () => {
    expect(isNumber(1.5)).toBe(true);
    expect(isNumber(Number.NaN)).toBe(false);
    expect(isNumber(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isInteger(3)).toBe(true);
    expect(isInteger(1.5)).toBe(false);
  });

  it("distinguishes arrays and records", () => {
    expect(isArray([])).toBe(true);
    expect(isArray({})).toBe(false);
    expect(isRecord({ city: "Stockholm" })).toBe(true);
    expect(isRecord([])).toBe(false);
    expect(isRecord(null)).toBe(false);
    expect(isRecord(new Date())).toBe(false);
  });

  it("checks array items and record values with a guard", () => {
    expect(isArrayOf([1, 2, 3], isInteger)).toBe(true);
    expect(isArrayOf([1, "2"], isInteger)).toBe(false);
    expect(isRecordOf({ east: 12, west: 3 }, isNumber)).toBe(true);
    expect(isRecordOf({ east: 12, west: "3" }, isNumber)).toBe(false);
  });

  it("composes optional and nullable values with a guard", () => {
    expect(isOptional(undefined, isString)).toBe(true);
    expect(isOptional("Stockholm", isString)).toBe(true);
    expect(isOptional(null, isString)).toBe(false);
    expect(isNullable(null, isString)).toBe(true);
    expect(isNullable("Stockholm", isString)).toBe(true);
    expect(isNullable(undefined, isString)).toBe(false);
  });

  it("checks literal values", () => {
    const ranges = /** @type {const} */ (["week", "month", "year"]);

    expect(isOneOf("month", ranges)).toBe(true);
    expect(isOneOf("day", ranges)).toBe(false);
  });
});
