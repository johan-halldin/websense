import { UiColorInput } from "./color-input.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_color_input(root) {
  /** @type {string|null} */
  let color = "#002fa7";
  const input = new UiColorInput();
  function render() {
    input.ic = {
      label: "Primary color",
      value: color,
      onInput: (value) => {
        color = value;
        render();
      },
    };
  }
  render();
  root.appendChild(input);

  /** @type {string|null} */
  let unsetColor = null;
  const unsetInput = new UiColorInput();
  function renderUnset() {
    unsetInput.ic = {
      label: "Accent color",
      value: unsetColor,
      onInput: (value) => {
        unsetColor = value;
        renderUnset();
      },
    };
  }
  renderUnset();
  root.appendChild(unsetInput);

  const disabledInput = new UiColorInput();
  disabledInput.ic = { label: "Disabled", value: "#fecc00" };
  root.appendChild(disabledInput);
}

export { init_example_color_input };
