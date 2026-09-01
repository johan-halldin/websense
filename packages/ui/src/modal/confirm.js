import { UiButton } from "../button/button.wc.js";
import { UiModal } from "./modal.wc.js";

/**
 * @typedef {object} ConfirmOptions
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [confirmLabel]
 * @property {string} [cancelLabel]
 */

/**
 * Shows a confirm dialog and resolves with whether the user confirmed.
 * Confirming, cancelling, pressing Escape, and clicking the backdrop all
 * funnel through the same native "close" event - there's exactly one
 * resolve() call, reading whichever outcome actually happened.
 *
 * @param {ConfirmOptions} options
 * @returns {Promise<boolean>}
 */
function async_confirm(options) {
  return new Promise((resolve) => {
    const modal = new UiModal();
    let confirmed = false;

    if (options.title !== undefined) {
      const titleElement = document.createElement("h3");
      titleElement.textContent = options.title;
      modal.appendChild(titleElement);
    }

    if (options.description !== undefined) {
      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = options.description;
      descriptionElement.style.color = "var(--color-text-muted)";
      descriptionElement.style.fontSize = "13px";
      modal.appendChild(descriptionElement);
    }

    const buttonRow = document.createElement("div");
    buttonRow.className = "ui-row ui-gap-sm ui-justify-end";

    const cancelButton = new UiButton();
    cancelButton.ic = {
      label: options.cancelLabel ?? "Cancel",
      onClick: () => modal.close(),
    };
    buttonRow.appendChild(cancelButton);

    const confirmButton = new UiButton();
    confirmButton.ic = {
      label: options.confirmLabel ?? "OK",
      variant: "primary",
      onClick: () => {
        confirmed = true;
        modal.close();
      },
    };
    buttonRow.appendChild(confirmButton);

    modal.appendChild(buttonRow);
    modal.addEventListener("close", () => resolve(confirmed));

    document.body.appendChild(modal);
    modal.showModal();
  });
}

export { async_confirm };
