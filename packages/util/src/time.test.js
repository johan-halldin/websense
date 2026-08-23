import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./time.js";

describe("formatRelativeTime", () => {
  const now = new Date("2026-01-01T12:00:00.000Z");

  it("returns 'just now' for a date within the last few seconds", () => {
    const date = new Date(now.getTime() - 2 * 1000);
    expect(formatRelativeTime(date, now)).toBe("just now");
  });

  it("returns whole seconds under a minute", () => {
    const date = new Date(now.getTime() - 42 * 1000);
    expect(formatRelativeTime(date, now)).toBe("42s ago");
  });

  it("returns whole minutes under an hour", () => {
    const date = new Date(now.getTime() - 5 * 60 * 1000);
    expect(formatRelativeTime(date, now)).toBe("5m ago");
  });

  it("returns whole hours under a day", () => {
    const date = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    expect(formatRelativeTime(date, now)).toBe("3h ago");
  });

  it("returns whole days beyond a day", () => {
    const date = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(date, now)).toBe("2d ago");
  });
});
