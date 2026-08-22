import { UiNumberInput } from "./number-input.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_number_input(root) {
  let age = 25;
  const input = new UiNumberInput();
  function render() {
    input.ic = {
      label: "Age",
      min: 0,
      max: 120,
      step: 1,
      value: age,
      onInput: (value) => {
        age = value;
        render();
      },
    };
  }
  render();
  root.appendChild(input);

  const disabledInput = new UiNumberInput();
  disabledInput.ic = { label: "Disabled", value: 42 };
  root.appendChild(disabledInput);
}

export { init_example_number_input };
