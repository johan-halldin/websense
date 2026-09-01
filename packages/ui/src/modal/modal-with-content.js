import { UiButton } from "../button/button.wc.js";
import { UiModal } from "./modal.wc.js";

/** @import { ConfirmOptions } from "./confirm.js" */
/** @import { AlertOptions } from "./alert.js" */

/**
 * @template TIc
 * @typedef {object} ModalContentRender
 * @property {TIc} ic
 * @property {boolean} [canConfirm]
 */

/**
 * @typedef {ConfirmOptions & {mode?: "confirm"}} AsyncConfirmModalOptions
 */

/**
 * @typedef {AlertOptions & {mode: "alert"}} AsyncAlertModalOptions
 */

/**
 * @typedef {AsyncConfirmModalOptions|AsyncAlertModalOptions} AsyncModalOptions
 */

/**
 * Embeds an arbitrary ic-driven web component as a modal's content, with
 * live re-render exactly like a `jc` drives a `wc` elsewhere in this
 * codebase: `makeIc(on_change)` runs once up front and again every time
 * `on_change()` fires, each time producing the content's `ic` and, in confirm
 * mode, whether confirming is currently allowed (e.g. a form isn't valid
 * yet). Alert mode renders one close button instead. The confirm button
 * follows the same on*-absence-means-disabled convention as every other
 * component here, rather than a separate enable/disable callback.
 *
 * @template TIc
 * @param {HTMLElement & {ic: TIc}} element
 * @param {(on_change: () => void) => ModalContentRender<TIc>} makeIc
 * @param {AsyncModalOptions} [options]
 * @returns {Promise<boolean>}
 */
function async_modal_with_content(element, makeIc, options = {}) {
  return new Promise((resolve) => {
    const modal = new UiModal();
    const mode = options.mode ?? "confirm";
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

    modal.appendChild(element);

    const buttonRow = document.createElement("div");
    buttonRow.className = "ui-row ui-gap-sm ui-justify-end";
    buttonRow.style.marginTop = "var(--space-sm)";
    const cancelButton = mode === "confirm" ? new UiButton() : undefined;
    const confirmButton = mode === "confirm" ? new UiButton() : undefined;
    const closeButton = mode === "alert" ? new UiButton() : undefined;
    if (cancelButton !== undefined) {
      buttonRow.appendChild(cancelButton);
    }
    if (confirmButton !== undefined) {
      buttonRow.appendChild(confirmButton);
    }
    if (closeButton !== undefined) {
      buttonRow.appendChild(closeButton);
    }
    modal.appendChild(buttonRow);

    function render() {
      const { ic, canConfirm } = makeIc(render);
      element.ic = ic;
      if (
        options.mode !== "alert" &&
        cancelButton !== undefined &&
        confirmButton !== undefined
      ) {
        cancelButton.ic = {
          label: options.cancelLabel ?? "Cancel",
          onClick: () => modal.close(),
        };
        confirmButton.ic = {
          label: options.confirmLabel ?? "OK",
          variant: "primary",
          ...(canConfirm === true
            ? {
                onClick: () => {
                  confirmed = true;
                  modal.close();
                },
              }
            : {}),
        };
      }
      if (options.mode === "alert" && closeButton !== undefined) {
        closeButton.ic = {
          label: options.closeLabel ?? "OK",
          variant: "primary",
          onClick: () => modal.close(),
        };
      }
    }
    render();

    modal.addEventListener("close", () => resolve(confirmed));

    document.body.appendChild(modal);
    modal.showModal();
  });
}

export { async_modal_with_content };
