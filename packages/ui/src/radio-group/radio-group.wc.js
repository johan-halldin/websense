import { css, html, LitElement } from "lit";

/**
 * @typedef {object} IRadioOption
 * @property {string} value
 * @property {string} label
 * @property {string} [tooltip]
 */

/**
 * @typedef {object} IRadioGroup
 * @property {string} value
 * @property {IRadioOption[]} options
 * @property {(value: string) => void} [onChange]
 */

export class WsRadioGroup extends LitElement {
  /** @override */
  static styles = css`
    fieldset {
      display: flex;
      flex-direction: column;
      gap: 6px;
      border: none;
      margin: 0;
      padding: 0;
    }
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

  /** @type {IRadioGroup|null} */
  #ic = null;

  /** @param {IRadioGroup} ic */
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
      <fieldset>
        ${ic.options.map(
          (option) => html`
            <label title=${option.tooltip ?? ""}>
              <input
                type="radio"
                name="option"
                .checked=${ic.value === option.value}
                ?disabled=${disabled}
                @change=${() => onChange?.(option.value)}
              />
              ${option.label}
            </label>
          `,
        )}
      </fieldset>
    `;
  }
}

customElements.define("ws-radio-group", WsRadioGroup);
