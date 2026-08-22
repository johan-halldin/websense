import { UiButton } from "../button/button.wc.js";
import { with_blocking_spinner } from "./blocking-spinner.js";

/**
 * @param {HTMLElement} root
 */
function init_example_spinner(root) {
  const button = new UiButton();
  button.ic = {
    label: "Run 2s task",
    onClick: () =>
      with_blocking_spinner(
        new Promise((resolve) => setTimeout(resolve, 2000)),
        "Working...",
      ),
  };
  root.appendChild(button);
}

export { init_example_spinner };
