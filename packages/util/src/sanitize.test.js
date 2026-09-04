import { describe, expect, it } from "vitest";
import {
  isArray,
  isArrayOf,
  isBoolean,
  isInteger,
  isNumber,
  isRecord,
  isRecordOf,
  isString,
} from "./sanitize.js";

describe("sanitize guards", () => {
  it("identifies primitive values", () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean("true")).toBe(false);
    expect(isString("WebSense")).toBe(true);
    expect(isString(42)).toBe(false);
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
});
