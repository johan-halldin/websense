import { describe, expect, it, vi } from "vitest";
import { clamp, randomIndex } from "./math.js";

describe("clamp", () => {
  it("returns the value when it is within the range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("returns the minimum when the value is too low", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("returns the maximum when the value is too high", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe("randomIndex", () => {
  it("returns an index within the requested length", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9999);

    expect(randomIndex(3)).toBe(2);

    vi.restoreAllMocks();
  });

  it("asserts non-positive and non-integer lengths", () => {
    const assert = vi.spyOn(console, "assert").mockImplementation(() => {});

    randomIndex(0);
    randomIndex(1.5);

    expect(assert).toHaveBeenCalledTimes(2);
    expect(assert).toHaveBeenCalledWith(
      false,
      "randomIndex length must be a positive integer",
    );

    vi.restoreAllMocks();
  });
});
