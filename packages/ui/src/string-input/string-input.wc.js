import { css, html, LitElement } from "lit";

/**
 * @typedef {object} IStringInput
 * @property {string} value
 * @property {string} [label]
 * @property {string} [placeholder]
 * @property {string} [tooltip]
 * @property {string} [error] - validation message; also switches the input
 *   into an error visual state when set
 * @property {(value: string) => void} [onInput]
 */

export class UiStringInput extends LitElement {
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

  /** @type {IStringInput|null} */
  #ic = null;

  /** @param {IStringInput} ic */
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
          class=${ic.error !== undefined ? "error" : ""}
          .value=${ic.value}
          placeholder=${ic.placeholder ?? ""}
          ?disabled=${disabled}
          ?aria-invalid=${ic.error !== undefined}
          @input=${(/** @type {Event} */ e) =>
            ic.onInput?.(/** @type {HTMLInputElement} */ (e.target).value)}
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

customElements.define("ui-string-input", UiStringInput);
