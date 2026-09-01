import { UiButton } from "../button/button.wc.js";
import { UiModal } from "./modal.wc.js";

/**
 * @typedef {object} AlertOptions
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [closeLabel]
 */

/**
 * Shows an alert dialog and resolves after it closes.
 *
 * @param {AlertOptions} options
 * @returns {Promise<void>}
 */
function async_alert(options) {
  return new Promise((resolve) => {
    const modal = new UiModal();

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
    buttonRow.style.marginTop = "var(--space-sm)";

    const closeButton = new UiButton();
    closeButton.ic = {
      label: options.closeLabel ?? "OK",
      variant: "primary",
      onClick: () => modal.close(),
    };
    buttonRow.appendChild(closeButton);

    modal.appendChild(buttonRow);
    modal.addEventListener("close", () => resolve());

    document.body.appendChild(modal);
    modal.showModal();
  });
}

export { async_alert };
