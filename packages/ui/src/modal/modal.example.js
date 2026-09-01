import { css, html, LitElement } from "lit";
import { UiButton } from "../button/button.wc.js";
import { async_confirm } from "./confirm.js";
import { async_modal_with_content } from "./modal-with-content.js";
import { UiModal } from "./modal.wc.js";

/**
 * @typedef {object} IDemoNameForm
 * @property {string} value
 * @property {(value: string) => void} [onInput]
 */

/** A minimal ic-driven form, local to this example (not a design-system component). */
class DemoNameForm extends LitElement {
  /** @override */
  static styles = css`
    label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 14px;
      color: var(--color-text);
    }
    input {
      padding: 6px 8px;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font: inherit;
    }
  `;

  /** @type {IDemoNameForm|null} */
  #ic = null;

  /** @param {IDemoNameForm} ic */
  set ic(ic) {
    this.#ic = ic;
    this.requestUpdate();
  }

  /** @override */
  render() {
    const ic = this.#ic;
    if (ic === null) {
      return "";
    }
    return html`
      <label>
        Name (required)
        <input
          .value=${ic.value}
          @input=${(/** @type {Event} */ e) =>
            ic.onInput?.(/** @type {HTMLInputElement} */ (e.target).value)}
        />
      </label>
    `;
  }
}
customElements.define("demo-name-form", DemoNameForm);

/**
 * @param {HTMLElement} root
 */
function init_example_modal(root) {
  const plainButton = new UiButton();
  plainButton.ic = {
    label: "Open plain modal",
    onClick: () => {
      const modal = new UiModal();
      const p = document.createElement("p");
      p.textContent = "Click the backdrop, press Escape, or close it below.";
      modal.appendChild(p);
      const closeButton = new UiButton();
      closeButton.ic = { label: "Close", onClick: () => modal.close() };
      modal.appendChild(closeButton);
      document.body.appendChild(modal);
      modal.showModal();
    },
  };
  root.appendChild(plainButton);

  const confirmButton = new UiButton();
  confirmButton.ic = {
    label: "Open confirm dialog",
    onClick: async () => {
      const result = await async_confirm({
        title: "Please confirm",
        description:
          "Are you sure you want to continue? This action cannot be undone.",
      });
      console.log("Confirmed:", result);
    },
  };
  root.appendChild(confirmButton);

  const promptButton = new UiButton();
  promptButton.ic = {
    label: "Open form dialog",
    onClick: async () => {
      let value = "";
      const element = new DemoNameForm();
      const result = await async_modal_with_content(
        element,
        (on_change) => ({
          ic: {
            value,
            onInput: (newValue) => {
              value = newValue;
              on_change();
            },
          },
          canConfirm: value.trim() !== "",
        }),
        {
          title: "Enter your name",
          description: "This is shown on your public profile.",
          confirmLabel: "Save",
        },
      );
      console.log("Confirmed:", result, "Value:", value);
    },
  };
  root.appendChild(promptButton);
}

export { init_example_modal };
