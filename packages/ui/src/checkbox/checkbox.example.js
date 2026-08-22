import { WsCheckbox } from "./checkbox.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_checkbox(root) {
  const checkedBox = new WsCheckbox();
  checkedBox.ic = {
    checked: true,
    label: "Checked",
    tooltip: "Toggle me",
    onChange: (checked) => console.log("Changed", checked),
  };
  root.appendChild(checkedBox);

  const uncheckedBox = new WsCheckbox();
  uncheckedBox.ic = {
    checked: false,
    label: "Unchecked",
    onChange: (checked) => console.log("Changed", checked),
  };
  root.appendChild(uncheckedBox);

  const disabledBox = new WsCheckbox();
  disabledBox.ic = { checked: true, label: "Disabled" };
  root.appendChild(disabledBox);
}

export { init_example_checkbox };
