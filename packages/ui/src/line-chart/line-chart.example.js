import { UiLineChart } from "./line-chart.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_line_chart(root) {
  const chart = new UiLineChart();
  chart.ic = {
    label: "RTT (ms)",
    points: [
      { label: "10:00", value: 42 },
      { label: "10:05", value: 45 },
      { label: "10:10", value: 41 },
      { label: "10:15", value: 58 },
      { label: "10:20", value: 47 },
      { label: "10:25", value: 44 },
      { label: "10:30", value: 46 },
    ],
  };
  root.appendChild(chart);
}

export { init_example_line_chart };
