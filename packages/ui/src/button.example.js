import { WsButton } from "./button.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_button(root) {
  const normalButton = new WsButton();
  normalButton.ic = {
    title: "Click me",
    onClick: () => console.log("Clicked"),
  };
  root.appendChild(normalButton);

  const disabledButton = new WsButton();
  disabledButton.ic = { title: "Disabled" };
  root.appendChild(disabledButton);
}

export { init_example_button };
