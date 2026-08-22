import { css, html, LitElement } from "lit";

/**
 * @typedef {object} IColorInput
 * @property {string} value
 * @property {string} [label]
 * @property {string} [tooltip]
 * @property {(value: string) => void} [onInput]
 */

export class UiColorInput extends LitElement {
  /** @override */
  static styles = css`
    label {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font: inherit;
      font-size: 14px;
      color: var(--color-text);
    }
    input {
      width: 32px;
      height: 32px;
      padding: 2px;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      background-color: var(--color-surface);
      cursor: pointer;
    }
    input:disabled {
      cursor: default;
      opacity: 0.5;
    }
  `;

  /** @type {IColorInput|null} */
  #ic = null;

  /** @param {IColorInput} ic */
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
          type="color"
          .value=${ic.value}
          ?disabled=${disabled}
          @input=${(/** @type {Event} */ e) =>
            ic.onInput?.(/** @type {HTMLInputElement} */ (e.target).value)}
        />
      </label>
    `;
  }
}

customElements.define("ui-color-input", UiColorInput);
