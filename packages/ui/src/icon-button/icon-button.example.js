import { UiIconButton } from "./icon-button.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_icon_button(root) {
  const defaultButton = new UiIconButton();
  defaultButton.ic = {
    icon: "trash-2",
    tooltip: "Delete",
    onClick: () => console.log("Clicked delete"),
  };
  root.appendChild(defaultButton);

  const largeButton = new UiIconButton();
  largeButton.ic = {
    icon: "download",
    tooltip: "Download",
    size: 24,
    onClick: () => console.log("Clicked download"),
  };
  root.appendChild(largeButton);

  const coloredButton = new UiIconButton();
  coloredButton.ic = {
    icon: "circle-check",
    tooltip: "Approve",
    color: "var(--color-success)",
    onClick: () => console.log("Clicked approve"),
  };
  root.appendChild(coloredButton);

  const disabledButton = new UiIconButton();
  disabledButton.ic = { icon: "bell", tooltip: "Notifications (disabled)" };
  root.appendChild(disabledButton);
}

export { init_example_icon_button };
