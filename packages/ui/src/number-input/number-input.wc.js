import { css, html, LitElement } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

/**
 * @typedef {object} INumberInput
 * @property {number} value
 * @property {string} [label]
 * @property {string} [placeholder]
 * @property {string} [tooltip]
 * @property {number} [min]
 * @property {number} [max]
 * @property {number} [step]
 * @property {(value: number) => void} [onInput]
 */

export class UiNumberInput extends LitElement {
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
          .valueAsNumber=${ic.value}
          placeholder=${ifDefined(ic.placeholder)}
          min=${ifDefined(ic.min)}
          max=${ifDefined(ic.max)}
          step=${ifDefined(ic.step)}
          ?disabled=${disabled}
          @input=${(/** @type {Event} */ e) => {
            const valueAsNumber = /** @type {HTMLInputElement} */ (e.target)
              .valueAsNumber;
            if (!Number.isNaN(valueAsNumber)) {
              ic.onInput?.(valueAsNumber);
            }
          }}
        />
      </label>
    `;
  }
}

customElements.define("ui-number-input", UiNumberInput);
