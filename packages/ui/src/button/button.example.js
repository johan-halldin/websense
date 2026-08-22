import { UiButton } from "./button.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_button(root) {
  const normalButton = new UiButton();
  normalButton.ic = {
    label: "Click me",
    onClick: () => console.log("Clicked"),
  };
  root.appendChild(normalButton);

  const disabledButton = new UiButton();
  disabledButton.ic = { label: "Disabled" };
  root.appendChild(disabledButton);

  const iconButton = new UiButton();
  iconButton.ic = {
    label: "Download",
    icon: "download",
    tooltip: "Download the file",
    onClick: () => console.log("Clicked download"),
  };
  root.appendChild(iconButton);

  const iconOnlyButton = new UiButton();
  iconOnlyButton.ic = {
    icon: "trash-2",
    tooltip: "Delete",
    onClick: () => console.log("Clicked delete"),
  };
  root.appendChild(iconOnlyButton);
}

export { init_example_button };
