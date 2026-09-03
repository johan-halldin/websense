import { UiField } from "./field.wc.js";
import { UiSegmentedControl } from "../segmented-control/segmented-control.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_field(root) {
  let value = "week";
  const field = new UiField();
  const control = new UiSegmentedControl();

  field.ic = {
    label: "Time range",
    description: "Choose how observations are grouped.",
  };

  function render() {
    control.ic = {
      value,
      options: [{ value: "day" }, { value: "week" }, { value: "month" }],
      onChange: (newValue) => {
        value = newValue;
        render();
      },
    };
  }
  render();

  field.appendChild(control);
  root.appendChild(field);

  const invalidField = new UiField();
  const requiredControl = new UiSegmentedControl();
  let requiredValue = "";

  function renderRequiredField() {
    invalidField.ic = {
      label: "Report interval",
      ...(requiredValue === ""
        ? { error: "An interval must be selected before continuing." }
        : {}),
    };
    requiredControl.ic = {
      value: requiredValue,
      options: [{ value: "daily" }, { value: "weekly" }],
      onChange: (newValue) => {
        requiredValue = newValue;
        renderRequiredField();
      },
    };
  }
  renderRequiredField();

  invalidField.appendChild(requiredControl);
  root.appendChild(invalidField);
}

export { init_example_field };
