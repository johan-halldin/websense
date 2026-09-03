import { css, html, LitElement } from "lit";
import { iconBaseStyle } from "../icons/icon-styles.js";

/** @import { IconName } from "../icons/icon-types.js" */

/**
 * @typedef {object} IBadge
 * @property {string} label
 * @property {IconName} [icon]
 * @property {string} [tooltip]
 * @property {"sm"|"md"|"lg"} [size] - defaults to "md"
 * @property {string} [backgroundColor]
 * @property {string} [textColor]
 * @property {string} [iconColor]
 */

/** A compact, non-interactive status label. */
class UiBadge extends LitElement {
  /** @override */
  static styles = [
    iconBaseStyle,
    css`
      :host {
        display: inline-flex;
        inline-size: fit-content;
        block-size: fit-content;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-xs);
        border-radius: 4px;
        font: inherit;
        line-height: 1.25;
      }
      .sm {
        font-size: 12px;
        padding: var(--space-2xs) calc(var(--space-sm) - var(--space-2xs));
      }
      .sm .icon {
        --icon-scale: 0.75;
      }
      .md {
        font-size: 14px;
        padding: var(--space-2xs) var(--space-sm);
      }
      .md .icon {
        --icon-scale: 0.875;
      }
      .lg {
        font-size: 16px;
        padding: var(--space-xs) calc(var(--space-sm) + var(--space-2xs));
      }
      .lg .icon {
        --icon-scale: 1;
      }
    `,
  ];

  /** @type {IBadge|null} */
  #ic = null;

  /** @param {IBadge} ic */
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
    const backgroundColor = ic.backgroundColor ?? "var(--color-background)";
    const textColor = ic.textColor ?? "var(--color-text)";
    const iconColor = ic.iconColor ?? textColor;
    const size = ic.size ?? "md";

    return html`
      <span
        class="badge ${size}"
        part="badge"
        title=${ic.tooltip ?? ""}
        style="background-color: ${backgroundColor}; color: ${textColor};"
      >
        ${
          ic.icon !== undefined
            ? html`<span
                class="icon"
                part="icon"
                aria-hidden="true"
                style="mask-image: var(--icon-${ic.icon}); -webkit-mask-image: var(--icon-${ic.icon}); --icon-color: ${iconColor};"
              ></span>`
            : ""
        }
        <span part="label">${ic.label}</span>
      </span>
    `;
  }
}

customElements.define("ui-badge", UiBadge);

export { UiBadge };
