import { describe, expect, it } from "vitest";
import {
  sanitizeApiCityPairMeasurements,
  sanitizeApiCorrelations,
  sanitizeApiMeshRows,
} from "./index.js";

describe("measurement API contracts", () => {
  it("sanitizes city-pair measurements", () => {
    const measurement = {
      time: "2026-09-04T12:00:00.000Z",
      rttMs: 31.2,
      packetLossPct: null,
    };

    expect(sanitizeApiCityPairMeasurements([measurement])).toEqual([
      measurement,
    ]);
    expect(
      sanitizeApiCityPairMeasurements([{ ...measurement, rttMs: "31.2" }]),
    ).toBeNull();
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

    expect(sanitizeApiCorrelations([correlation])).toEqual([correlation]);
    expect(
      sanitizeApiCorrelations([{ ...correlation, correlation: 1.1 }]),
    ).toBeNull();
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

    expect(sanitizeApiMeshRows([row])).toEqual([row]);
    expect(sanitizeApiMeshRows([{ ...row, dstLat: 100 }])).toBeNull();
  });
});
