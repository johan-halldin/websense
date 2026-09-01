import { css, html, LitElement } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

/**
 * @typedef {object} INumberInput
 * @property {number|null} value - null means the field is empty, a real,
 *   representable state (not an error) - e.g. an optional numeric field.
 * @property {string} [label]
 * @property {string} [placeholder]
 * @property {string} [tooltip]
 * @property {number} [min]
 * @property {number} [max]
 * @property {number} [step]
 * @property {string} [error] - validation message; also switches the input
 *   into an error visual state when set
 * @property {(value: number|null) => void} [onInput]
 */

class UiNumberInput extends LitElement {
  /** @override */
  static styles = css`
    label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font: inherit;
      font-size: 14px;
      color: var(--color-text);
    }
    input {
      padding: 6px 8px;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font: inherit;
      color: var(--color-text);
      background-color: var(--color-surface);
    }
    input:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: -1px;
    }
    input:disabled {
      cursor: default;
      opacity: 0.5;
    }
    input.error {
      border-color: var(--color-error);
    }
    .error-message {
      font-size: 12px;
      color: var(--color-error);
    }
  `;

  /** @type {INumberInput|null} */
  #ic = null;

  /** @param {INumberInput} ic */
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
    const disabled = ic.onInput === undefined;

    return html`
      <label title=${ic.tooltip ?? ""}>
        ${ic.label ?? ""}
        <input
          type="number"
          class=${ic.error !== undefined ? "error" : ""}
          .valueAsNumber=${ic.value}
          placeholder=${ifDefined(ic.placeholder)}
          min=${ifDefined(ic.min)}
          max=${ifDefined(ic.max)}
          step=${ifDefined(ic.step)}
          ?disabled=${disabled}
          ?aria-invalid=${ic.error !== undefined}
          @input=${(/** @type {Event} */ e) => {
            const valueAsNumber = /** @type {HTMLInputElement} */ (e.target)
              .valueAsNumber;
            ic.onInput?.(Number.isNaN(valueAsNumber) ? null : valueAsNumber);
          }}
        />
        ${
          ic.error !== undefined
            ? html`<span class="error-message">${ic.error}</span>`
            : ""
        }
      </label>
    `;
  }
}

customElements.define("ui-number-input", UiNumberInput);

export { UiNumberInput };
