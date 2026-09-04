import { describe, expect, it } from "vitest";
import {
  isApiCityPairMeasurements,
  isApiCityPairGrouping,
  isApiCityPairRange,
  isApiCorrelations,
  isApiCorrelationGrouping,
  isApiCorrelationRange,
  isApiMeshRows,
} from "./index.js";

describe("measurement API contracts", () => {
  it("sanitizes city-pair measurements", () => {
    const measurement = {
      time: "2026-09-04T12:00:00.000Z",
      rttMs: 31.2,
      packetLossPct: null,
    };

    expect(isApiCityPairMeasurements([measurement])).toBe(true);
    expect(isApiCityPairMeasurements([{ ...measurement, rttMs: "31.2" }])).toBe(
      false,
    );
  });

  it("sanitizes correlations", () => {
    const correlation = {
      firstSrcName: "Stockholm",
      firstDstName: "Tokyo",
      secondSrcName: "London",
      secondDstName: "Singapore",
      correlation: -0.75,
      sharedBuckets: 48,
      isSymmetric: false,
    };

    expect(isApiCorrelations([correlation])).toBe(true);
    expect(isApiCorrelations([{ ...correlation, correlation: 1.1 }])).toBe(
      false,
    );
  });

  it("sanitizes mesh rows", () => {
    const row = {
      srcName: "Stockholm",
      srcLat: 59.3293,
      srcLon: 18.0686,
      dstName: "Tokyo",
      dstLat: 35.6762,
      dstLon: 139.6503,
      time: "2026-09-04T12:00:00.000Z",
      rttAvgMs: 240.3,
      packetLossPct: 0,
      avgRttMs: 236.7,
      avgPacketLossPct: 0.1,
    };

    expect(isApiMeshRows([row])).toBe(true);
    expect(isApiMeshRows([{ ...row, dstLat: 100 }])).toBe(false);
  });

  it("checks supported query values", () => {
    expect(isApiCityPairRange("week")).toBe(true);
    expect(isApiCityPairRange("quarter")).toBe(false);
    expect(isApiCityPairGrouping("none")).toBe(true);
    expect(isApiCityPairGrouping("minute")).toBe(false);
    expect(isApiCorrelationRange("month")).toBe(true);
    expect(isApiCorrelationRange("day")).toBe(false);
    expect(isApiCorrelationGrouping("hour")).toBe(true);
    expect(isApiCorrelationGrouping("none")).toBe(false);
  });
});
