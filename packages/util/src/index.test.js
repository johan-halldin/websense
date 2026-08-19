import { describe, expect, it } from "vitest";
import { clamp } from "./index.js";

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
