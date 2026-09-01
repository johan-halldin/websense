import { css, html, LitElement } from "lit";
import { iconBaseStyle } from "../icons/icon-styles.js";

/** @import { IconName } from "../icons/icon-types.js" */

/** @type {Record<"info"|"success"|"warning"|"error", IconName>} */
const DEFAULT_ICON = {
  info: "info",
  success: "circle-check",
  warning: "triangle-alert",
  error: "circle-x",
};

/**
 * @typedef {object} IToast
 * @property {string} message
 * @property {"info"|"success"|"warning"|"error"} [level]
 * @property {IconName} [icon] - defaults to an icon matching `level`
 * @property {() => void} [onDismiss]
 */

class UiToast extends LitElement {
  /** @override */
  static styles = [
    iconBaseStyle,
    css`
      .toast {
        display: flex;
        align-items: center;
        gap: 8px;
        max-width: 320px;
        padding: 10px 14px;
        border-radius: 6px;
        border-left: 3px solid var(--color-primary);
        background-color: var(--color-surface);
        color: var(--color-text);
        font: inherit;
        font-size: 14px;
        box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
        cursor: pointer;
      }
      .toast.success {
        border-left-color: var(--color-success);
        --icon-color: var(--color-success);
      }
      .toast.warning {
        border-left-color: var(--color-warning);
        --icon-color: var(--color-warning);
      }
      .toast.error {
        border-left-color: var(--color-error);
        --icon-color: var(--color-error);
      }
    `,
  ];

  /** @type {IToast|null} */
  #ic = null;

  /** @param {IToast} ic */
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
    const level = ic.level ?? "info";
    const icon = ic.icon ?? DEFAULT_ICON[level];

    return html`
      <div class="toast ${level}" @click=${() => ic.onDismiss?.()}>
        <span
          class="icon"
          style="mask-image: var(--icon-${icon}); -webkit-mask-image: var(--icon-${icon});"
        ></span>
        ${ic.message}
      </div>
    `;
  }
}

customElements.define("ui-toast", UiToast);

export { UiToast };
