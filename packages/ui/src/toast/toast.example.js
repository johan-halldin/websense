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
    onClick: () => show_toast("Deploy finished", { level: "success" }),
  };
  root.appendChild(successButton);

  const warningButton = new UiButton();
  warningButton.ic = {
    label: "Show warning toast",
    onClick: () =>
      show_toast("Running low on disk space", { level: "warning" }),
  };
  root.appendChild(warningButton);

  const errorButton = new UiButton();
  errorButton.ic = {
    label: "Show error toast",
    onClick: () => show_toast("Something went wrong", { level: "error" }),
  };
  root.appendChild(errorButton);

  const customIconButton = new UiButton();
  customIconButton.ic = {
    label: "Show toast with custom icon",
    onClick: () => show_toast("New message", { icon: "mail", level: "info" }),
  };
  root.appendChild(customIconButton);

  const manyButton = new UiButton();
  manyButton.ic = {
    label: "Show 3 at once",
    onClick: () => {
      show_toast("First");
      show_toast("Second", { level: "success" });
      show_toast("Third", { level: "error" });
    },
  };
  root.appendChild(manyButton);
}

export { init_example_toast };
