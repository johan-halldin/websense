import { describe, expect, it } from "vitest";
import { normalizeResults } from "./normalize.js";

describe("normalizeResults", () => {
  it("normalizes a successful ping result", () => {
    const rows = normalizeResults([
      {
        prb_id: 1001,
        msm_id: 5001,
        timestamp: 1700000000,
        dst_addr: "192.0.2.1",
        dst_name: "example.com",
        avg: 12.5,
        min: 10.1,
        max: 15.2,
        sent: 3,
        rcvd: 3,
      },
    ]);

    expect(rows).toEqual([
      {
        time: new Date(1700000000 * 1000),
        probeId: 1001,
        measurementId: 5001,
        dstAddr: "192.0.2.1",
        dstName: "example.com",
        rttAvgMs: 12.5,
        rttMinMs: 10.1,
        rttMaxMs: 15.2,
        packetLossPct: 0,
      },
    ]);
  });

  it("normalizes a fully lossy result reported as -1 rather than omitted", () => {
    const rows = normalizeResults([
      {
        prb_id: 1003,
        msm_id: 5001,
        timestamp: 1700000000,
        dst_addr: "192.0.2.1",
        avg: -1,
        min: -1,
        max: -1,
        sent: 3,
        rcvd: 0,
      },
    ]);

    expect(rows).toEqual([
      {
        time: new Date(1700000000 * 1000),
        probeId: 1003,
        measurementId: 5001,
        dstAddr: "192.0.2.1",
        dstName: null,
        rttAvgMs: null,
        rttMinMs: null,
        rttMaxMs: null,
        packetLossPct: 100,
      },
    ]);
  });

  it("normalizes a fully lossy result with no avg/min/max", () => {
    const rows = normalizeResults([
      {
        prb_id: 1002,
        msm_id: 5001,
        timestamp: 1700000000,
        dst_addr: "192.0.2.1",
        sent: 3,
        rcvd: 0,
      },
    ]);

    expect(rows).toEqual([
      {
        time: new Date(1700000000 * 1000),
        probeId: 1002,
        measurementId: 5001,
        dstAddr: "192.0.2.1",
        dstName: null,
        rttAvgMs: null,
        rttMinMs: null,
        rttMaxMs: null,
        packetLossPct: 100,
      },
    ]);
  });
});
