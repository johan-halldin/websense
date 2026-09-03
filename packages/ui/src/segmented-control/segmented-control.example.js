import { UiSegmentedControl } from "./segmented-control.wc.js";

/** @import { SegmentedControlOption } from "./segmented-control.wc.js" */

/**
 * @param {HTMLElement} root
 */
function init_example_segmented_control(root) {
  /** @type {SegmentedControlOption[]} */
  const options = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month", tooltip: "View by month" },
  ];

  let value = "week";
  const control = new UiSegmentedControl();

  function render() {
    control.ic = {
      value,
      options,
      onChange: (newValue) => {
        value = newValue;
        render();
      },
    };
  }
  render();
  root.appendChild(control);

  const disabledControl = new UiSegmentedControl();
  disabledControl.ic = { value: "week", options };
  root.appendChild(disabledControl);
}

export { init_example_segmented_control };
