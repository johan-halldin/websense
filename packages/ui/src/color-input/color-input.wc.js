import { css, html, LitElement } from "lit";
import "../button/button.wc.js";

/**
 * @typedef {object} IColorInput
 * @property {string|null} value - null means no color is set. A native
 *   <input type="color"> can't represent "empty" itself (its .value always
 *   coerces to a valid hex color, and its picker has no clear affordance),
 *   so this shows a "Select" button instead of the swatch until a color is
 *   actually chosen, and a "Clear" button to get back to null.
 * @property {string} [label]
 * @property {string} [tooltip]
 * @property {(value: string|null) => void} [onInput]
 */

class UiColorInput extends LitElement {
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
    .control {
      position: relative;
      display: inline-flex;
      align-items: stretch;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      background-color: var(--color-surface);
      overflow: hidden;
    }
    input {
      width: 32px;
      height: 32px;
      padding: 2px;
      border: none;
      background-color: transparent;
      cursor: pointer;
    }
    input:disabled {
      cursor: default;
      opacity: 0.5;
    }
    /* Kept in the DOM (so it can still be .click()'d to open the native
       picker) but not visible - the "Select" button is shown instead. */
    input.hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .control ::part(button) {
      border: none;
      border-radius: 0;
    }
    .control input:not(.hidden) ~ ui-button::part(button) {
      border-left: 1px solid var(--color-border);
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
    const hasValue = ic.value !== null;

    return html`
      <label title=${ic.tooltip ?? ""}>
        ${ic.label ?? ""}
        <span class="control">
          <input
            type="color"
            class=${hasValue ? "" : "hidden"}
            .value=${ic.value ?? "#000000"}
            ?disabled=${disabled}
            @input=${(/** @type {Event} */ e) =>
              ic.onInput?.(/** @type {HTMLInputElement} */ (e.target).value)}
          />
          ${
            hasValue
              ? html`<ui-button
                  .ic=${{
                    label: "Clear",
                    ...(ic.onInput !== undefined
                      ? { onClick: () => ic.onInput?.(null) }
                      : {}),
                  }}
                ></ui-button>`
              : html`<ui-button
                  .ic=${{
                    label: "Select",
                    icon: "color-palette",
                    ...(ic.onInput !== undefined
                      ? { onClick: () => this.#openPicker() }
                      : {}),
                  }}
                ></ui-button>`
          }
        </span>
      </label>
    `;
  }

  #openPicker() {
    this.shadowRoot?.querySelector("input")?.click();
  }
}

customElements.define("ui-color-input", UiColorInput);

export { UiColorInput };
