import { UiStringInput } from "./string-input.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_string_input(root) {
  let name = "";
  const input = new UiStringInput();
  function render() {
    input.ic = {
      label: "Name",
      placeholder: "Enter your name",
      value: name,
      onInput: (value) => {
        name = value;
        render();
      },
    };
  }
  render();
  root.appendChild(input);

  const disabledInput = new UiStringInput();
  disabledInput.ic = {
    label: "Disabled",
    value: "Can't edit this",
  };
  root.appendChild(disabledInput);
}

export { init_example_string_input };
