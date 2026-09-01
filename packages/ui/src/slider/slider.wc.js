import { css, html, LitElement } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

/**
 * @typedef {object} ISlider
 * @property {number} value
 * @property {string} [label]
 * @property {string} [tooltip]
 * @property {number} [min] - defaults to 0
 * @property {number} [max] - defaults to 100
 * @property {number} [step] - defaults to 1
 * @property {(value: number) => void} [onInput]
 */

class UiSlider extends LitElement {
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
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    input {
      flex: 1;
      accent-color: var(--color-primary);
      cursor: pointer;
    }
    input:disabled {
      cursor: default;
      opacity: 0.5;
    }
    .value {
      min-width: 2em;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
  `;

  /** @type {ISlider|null} */
  #ic = null;

  /** @param {ISlider} ic */
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
        <span class="row">
          <input
            type="range"
            .valueAsNumber=${ic.value}
            min=${ifDefined(ic.min ?? 0)}
            max=${ifDefined(ic.max ?? 100)}
            step=${ifDefined(ic.step ?? 1)}
            ?disabled=${disabled}
            @input=${(/** @type {Event} */ e) =>
              ic.onInput?.(
                /** @type {HTMLInputElement} */ (e.target).valueAsNumber,
              )}
          />
          <span class="value">${ic.value}</span>
        </span>
      </label>
    `;
  }
}

customElements.define("ui-slider", UiSlider);

export { UiSlider };
