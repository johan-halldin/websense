import { UiButton } from "../button/button.wc.js";
import { UiModal } from "./modal.wc.js";

/**
 * @template TIc
 * @typedef {object} IModalContentRender
 * @property {TIc} ic
 * @property {boolean} canConfirm
 */

/**
 * @typedef {object} IAsyncModalOptions
 * @property {string} [title]
 * @property {string} [confirmLabel]
 * @property {string} [cancelLabel]
 */

/**
 * Embeds an arbitrary ic-driven web component as a modal's content, with
 * live re-render exactly like a `jc` drives a `wc` elsewhere in this
 * codebase: `makeIc(on_change)` runs once up front and again every time
 * `on_change()` fires, each time producing the content's `ic` and whether
 * confirming is currently allowed (e.g. a form isn't valid yet). The confirm
 * button follows the same on*-absence-means-disabled convention as every
 * other component here, rather than a separate enable/disable callback.
 *
 * @template TIc
 * @param {HTMLElement & {ic: TIc}} element
 * @param {(on_change: () => void) => IModalContentRender<TIc>} makeIc
 * @param {IAsyncModalOptions} [options]
 * @returns {Promise<boolean>}
 */
function async_modal_with_content(element, makeIc, options = {}) {
  return new Promise((resolve) => {
    const modal = new UiModal();
    let confirmed = false;

    if (options.title !== undefined) {
      const titleElement = document.createElement("h3");
      titleElement.textContent = options.title;
      modal.appendChild(titleElement);
    }

    modal.appendChild(element);

    const buttonRow = document.createElement("div");
    buttonRow.className = "ui-row ui-gap-sm ui-justify-end";
    const cancelButton = new UiButton();
    const confirmButton = new UiButton();
    buttonRow.appendChild(cancelButton);
    buttonRow.appendChild(confirmButton);
    modal.appendChild(buttonRow);

    function render() {
      const { ic, canConfirm } = makeIc(render);
      element.ic = ic;
      cancelButton.ic = {
        label: options.cancelLabel ?? "Cancel",
        onClick: () => modal.close(),
      };
      confirmButton.ic = {
        label: options.confirmLabel ?? "OK",
        ...(canConfirm
          ? {
              onClick: () => {
                confirmed = true;
                modal.close();
              },
            }
          : {}),
      };
    }
    render();

    modal.addEventListener("close", () => resolve(confirmed));

    document.body.appendChild(modal);
    modal.showModal();
  });
}

export { async_modal_with_content };
