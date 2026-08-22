/**
 * A thin wrapper around the native <dialog> element: open/close mechanics
 * and backdrop-click-to-close (a native <dialog> does NOT close on backdrop
 * click by itself - a common gotcha, handled here once). Focus trapping and
 * Escape-to-close both come from the browser via showModal(), no need to
 * reimplement either.
 *
 * Usage:
 *   const modal = new UiModal();
 *   modal.append(...);           // any content, including ui-button etc.
 *   document.body.appendChild(modal);
 *   modal.addEventListener("close", () => { ... });
 *   modal.showModal();
 *
 * No `ic` - like ui-popover, this is a structural wrapper, not a
 * data-driven component. It removes itself from the DOM once closed.
 */

const template = document.createElement("template");
template.innerHTML = `
  <style>
    dialog {
      border: none;
      border-radius: 8px;
      padding: 16px;
      background: var(--color-surface);
      color: var(--color-text);
      box-shadow: 0 8px 24px rgb(0 0 0 / 0.2);
      max-width: min(480px, calc(100vw - 32px));
      max-height: calc(100vh - 32px);
      overflow-y: auto;
    }
    dialog::backdrop {
      background: rgb(0 0 0 / 0.4);
    }
  </style>
  <dialog>
    <slot></slot>
  </dialog>
`;

class UiModal extends HTMLElement {
  /** @type {HTMLDialogElement} */
  #dialog;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    const dialog = /** @type {HTMLDialogElement} */ (
      shadowRoot.querySelector("dialog")
    );
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        this.close();
      }
    });
    dialog.addEventListener("close", () => {
      this.dispatchEvent(new Event("close"));
      this.remove();
    });
    this.#dialog = dialog;
  }

  showModal() {
    this.#dialog.showModal();
  }

  close() {
    this.#dialog.close();
  }
}

customElements.define("ui-modal", UiModal);

export { UiModal };
