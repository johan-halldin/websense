import { UiColorInput } from "./color-input.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_color_input(root) {
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

  const disabledInput = new UiColorInput();
  disabledInput.ic = { label: "Disabled", value: "#fecc00" };
  root.appendChild(disabledInput);
}

export { init_example_color_input };
