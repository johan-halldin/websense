import { css, html, LitElement } from "lit";
import { iconBaseStyle } from "../icons/icon-styles.js";

/** @import { IconName } from "../icons/icon-types.js" */

/**
 * @typedef {object} IIconButton
 * @property {IconName} icon
 * @property {string} [tooltip]
 * @property {number} [size] - icon size in pixels, defaults to 16
 * @property {string} [color] - CSS color, defaults to currentColor
 * @property {(e: MouseEvent) => void} [onClick]
 */

class UiIconButton extends LitElement {
  /** @override */
  static styles = [
    iconBaseStyle,
    css`
      button {
        all: unset;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0.7;
        transition:
          opacity 0.15s,
          transform 0.1s;
      }
      button:hover:not(:disabled) {
        opacity: 1;
      }
      button:active:not(:disabled) {
        transform: scale(0.95);
      }
      button:disabled {
        cursor: default;
        opacity: 0.3;
      }
    `,
  ];

  /** @type {IIconButton|null} */
  #ic = null;

  /** @param {IIconButton} ic */
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
    const size = ic.size ?? 16;
    const onClick = ic.onClick;
    const disabled = onClick === undefined;

    return html`
      <button
        part="button"
        ?disabled=${disabled}
        title=${ic.tooltip ?? ""}
        @click=${(/** @type {MouseEvent} */ e) => onClick?.(e)}
      >
        <span
          class="icon"
          style="mask-image: var(--icon-${ic.icon}); -webkit-mask-image: var(--icon-${ic.icon}); --icon-scale: ${
            size / 16
          };${ic.color !== undefined ? ` --icon-color: ${ic.color};` : ""}"
        ></span>
      </button>
    `;
  }
}

customElements.define("ui-icon-button", UiIconButton);

export { UiIconButton };
