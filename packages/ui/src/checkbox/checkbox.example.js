import { UiCheckbox } from "./checkbox.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_checkbox(root) {
  const checkedBox = new UiCheckbox();
  checkedBox.ic = {
    checked: true,
    label: "Checked",
    tooltip: "Toggle me",
    onChange: (checked) => console.log("Changed", checked),
  };
  root.appendChild(checkedBox);

  const uncheckedBox = new UiCheckbox();
  uncheckedBox.ic = {
    checked: false,
    label: "Unchecked",
    onChange: (checked) => console.log("Changed", checked),
  };
  root.appendChild(uncheckedBox);

  const disabledBox = new UiCheckbox();
  disabledBox.ic = { checked: true, label: "Disabled" };
  root.appendChild(disabledBox);
}

export { init_example_checkbox };
