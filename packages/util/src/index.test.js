import { describe, expect, it } from "vitest";
import { capitalize, clamp } from "./index.js";

describe("index", () => {
  it("re-exports math utils", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("re-exports string utils", () => {
    expect(capitalize("hello")).toBe("Hello");
  });
});
