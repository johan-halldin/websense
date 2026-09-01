import { css, html, LitElement } from "lit";

/**
 * @typedef {object} ICheckbox
 * @property {boolean} checked
 * @property {string} [label]
 * @property {string} [tooltip]
 * @property {(checked: boolean) => void} [onChange]
 */

class UiCheckbox extends LitElement {
  /** @override */
  static styles = css`
    label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font: inherit;
      font-size: 14px;
      color: var(--color-text);
      cursor: pointer;
    }
    input {
      width: 16px;
      height: 16px;
      accent-color: var(--color-primary);
      cursor: pointer;
    }
    label:has(input:disabled) {
      cursor: default;
      opacity: 0.5;
    }
    input:disabled {
      cursor: default;
    }
  `;

  /** @type {ICheckbox|null} */
  #ic = null;

  /** @param {ICheckbox} ic */
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
    const onChange = ic.onChange;
    const disabled = onChange === undefined;

    return html`
      <label title=${ic.tooltip ?? ""}>
        <input
          type="checkbox"
          .checked=${ic.checked}
          ?disabled=${disabled}
          @change=${(/** @type {Event} */ e) =>
            onChange?.(/** @type {HTMLInputElement} */ (e.target).checked)}
        />
        ${ic.label ?? ""}
      </label>
    `;
  }
}

customElements.define("ui-checkbox", UiCheckbox);

export { UiCheckbox };
