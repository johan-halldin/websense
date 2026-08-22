import { UiNumberInput } from "./number-input.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_number_input(root) {
  /** @type {number|null} */
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

  /** @type {number|null} */
  let quantity = null;
  const validatedInput = new UiNumberInput();
  function renderValidated() {
    validatedInput.ic = {
      label: "Quantity",
      min: 1,
      value: quantity,
      ...(quantity !== null && quantity < 1
        ? { error: "Must be at least 1" }
        : {}),
      onInput: (value) => {
        quantity = value;
        renderValidated();
      },
    };
  }
  renderValidated();
  root.appendChild(validatedInput);

  const disabledInput = new UiNumberInput();
  disabledInput.ic = { label: "Disabled", value: 42 };
  root.appendChild(disabledInput);
}

export { init_example_number_input };
