import { css, html, LitElement } from "lit";
import { iconBaseStyle } from "../icons/icon-styles.js";

/** @import { IconName } from "../icons/icon-types.js" */

/**
 * @typedef {object} IBadge
 * @property {string} label
 * @property {IconName} [icon]
 * @property {string} [tooltip]
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
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-xs);
        padding: var(--space-2xs) var(--space-sm);
        border-radius: 999px;
        font: inherit;
        font-size: 13px;
        line-height: 1.25;
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

    return html`
      <span
        class="badge"
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
