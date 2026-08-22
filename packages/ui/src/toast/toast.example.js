import { UiButton } from "../button/button.wc.js";
import { show_toast } from "./toast.js";

/**
 * @param {HTMLElement} root
 */
function init_example_toast(root) {
  const infoButton = new UiButton();
  infoButton.ic = {
    label: "Show info toast",
    onClick: () => show_toast("Saved successfully"),
  };
  root.appendChild(infoButton);

  const successButton = new UiButton();
  successButton.ic = {
    label: "Show success toast",
    onClick: () => show_toast("Deploy finished", { tone: "success" }),
  };
  root.appendChild(successButton);

  const errorButton = new UiButton();
  errorButton.ic = {
    label: "Show error toast",
    onClick: () => show_toast("Something went wrong", { tone: "error" }),
  };
  root.appendChild(errorButton);

  const manyButton = new UiButton();
  manyButton.ic = {
    label: "Show 3 at once",
    onClick: () => {
      show_toast("First");
      show_toast("Second", { tone: "success" });
      show_toast("Third", { tone: "error" });
    },
  };
  root.appendChild(manyButton);
}

export { init_example_toast };
