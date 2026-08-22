import { WsButton } from "./button.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_button(root) {
  const normalButton = new WsButton();
  normalButton.ic = {
    label: "Click me",
    onClick: () => console.log("Clicked"),
  };
  root.appendChild(normalButton);

  const disabledButton = new WsButton();
  disabledButton.ic = { label: "Disabled" };
  root.appendChild(disabledButton);

  const iconButton = new WsButton();
  iconButton.ic = {
    label: "Download",
    icon: "download",
    tooltip: "Download the file",
    onClick: () => console.log("Clicked download"),
  };
  root.appendChild(iconButton);

  const iconOnlyButton = new WsButton();
  iconOnlyButton.ic = {
    icon: "trash-2",
    tooltip: "Delete",
    onClick: () => console.log("Clicked delete"),
  };
  root.appendChild(iconOnlyButton);
}

export { init_example_button };
