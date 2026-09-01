import { UiLineChart } from "./line-chart.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_line_chart(root) {
  const chart = new UiLineChart();
  chart.ic = {
    label: "RTT (ms)",
    // Deliberately unevenly spaced, including a large gap, to show that
    // points are plotted by actual time rather than one slot each.
    points: [
      { time: "2026-01-01T10:00:00Z", value: 42 },
      { time: "2026-01-01T10:05:00Z", value: 45 },
      { time: "2026-01-01T10:10:00Z", value: 41 },
      { time: "2026-01-01T10:12:00Z", value: 43 },
      { time: "2026-01-01T11:05:00Z", value: 58 },
      { time: "2026-01-01T11:10:00Z", value: 47 },
      { time: "2026-01-01T11:35:00Z", value: 44 },
      { time: "2026-01-01T11:40:00Z", value: 46 },
    ],
  };
  root.appendChild(chart);
}

export { init_example_line_chart };
