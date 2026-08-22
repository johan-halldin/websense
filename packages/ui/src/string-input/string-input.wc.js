import { css, html, LitElement } from "lit";

/**
 * @typedef {object} IStringInput
 * @property {string} value
 * @property {string} [label]
 * @property {string} [placeholder]
 * @property {string} [tooltip]
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
          .value=${ic.value}
          placeholder=${ic.placeholder ?? ""}
          ?disabled=${disabled}
          @input=${(/** @type {Event} */ e) =>
            ic.onInput?.(/** @type {HTMLInputElement} */ (e.target).value)}
        />
      </label>
    `;
  }
}

customElements.define("ui-string-input", UiStringInput);
