import { css, html, LitElement } from "lit";
import { iconBaseStyle } from "../icons/icon-styles.js";

/**
 * @typedef {import("../icons/icon-types.js").IconName} IconName
 */

/**
 * @typedef {object} IButton
 * @property {string} [label]
 * @property {string} [tooltip]
 * @property {IconName} [icon]
 * @property {(e: MouseEvent) => void} [onClick]
 */

export class UiButton extends LitElement {
  /** @override */
  static styles = [
    iconBaseStyle,
    css`
      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        height: 32px;
        padding: 0 12px;
        font: inherit;
        font-size: 14px;
        color: var(--color-text);
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 4px;
        cursor: pointer;
      }
      button:hover:not(:disabled) {
        background-color: var(--color-background);
        border-color: var(--color-border-hover);
      }
      button:active:not(:disabled) {
        transform: scale(0.97);
      }
      button:disabled {
        cursor: default;
        opacity: 0.5;
      }
    `,
  ];

  /** @type {IButton|null} */
  #ic = null;

  /** @param {IButton} ic */
  set ic(ic) {
    this.#ic = ic;
    this.requestUpdate();
  }

  /** @override */
  render() {
    const ic = this.#ic;
    const label = ic?.label ?? "";
    const tooltip = ic?.tooltip;
    const icon = ic?.icon;
    const onClick = ic?.onClick;
    const disabled = onClick === undefined;

    return html`
      <button
        ?disabled=${disabled}
        title=${tooltip ?? ""}
        @click=${(/** @type {MouseEvent} */ e) => onClick?.(e)}
      >
        ${
          icon !== undefined
            ? html`<span
                class="icon"
                style="mask-image: var(--icon-${icon}); -webkit-mask-image: var(--icon-${icon});"
              ></span>`
            : ""
        }
        ${label}
      </button>
    `;
  }
}

customElements.define("ui-button", UiButton);
