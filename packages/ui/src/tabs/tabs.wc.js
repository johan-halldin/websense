import { css, html, LitElement } from "lit";
import { iconBaseStyle } from "../icons/icon-styles.js";

/**
 * @typedef {import("../icons/icon-types.js").IconName} IconName
 */

/**
 * @typedef {object} ITabOption
 * @property {string} value
 * @property {string} label
 * @property {string} [tooltip]
 * @property {IconName} [icon]
 */

/**
 * @typedef {object} ITabs
 * @property {string} value
 * @property {ITabOption[]} options
 * @property {(value: string) => void} [onChange]
 */

export class WsTabs extends LitElement {
  /** @override */
  static styles = [
    iconBaseStyle,
    css`
      #container {
        display: flex;
        flex-direction: row;
        gap: 4px;
        overflow-x: auto;
        border-bottom: 1px solid var(--color-border);
      }
      .tab {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        font: inherit;
        font-size: 14px;
        color: var(--color-text-muted);
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        white-space: nowrap;
        cursor: pointer;
      }
      .tab:hover:not(:disabled) {
        color: var(--color-text);
      }
      .tab.active {
        color: var(--color-text);
        border-bottom-color: var(--color-primary);
      }
      .tab:disabled {
        cursor: default;
        opacity: 0.5;
      }
    `,
  ];

  /** @type {ITabs|null} */
  #ic = null;

  /** @param {ITabs} ic */
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
      <div id="container">
        ${ic.options.map((tab) => {
          const isActive = tab.value === ic.value;
          return html`
            <button
              class="tab ${isActive ? "active" : ""}"
              ?disabled=${disabled}
              title=${tab.tooltip ?? ""}
              @click=${() => onChange?.(tab.value)}
            >
              ${
                tab.icon !== undefined
                  ? html`<span
                      class="icon"
                      style="mask-image: var(--icon-${tab.icon}); -webkit-mask-image: var(--icon-${tab.icon});"
                    ></span>`
                  : ""
              }
              ${tab.label}
            </button>
          `;
        })}
      </div>
    `;
  }
}

customElements.define("ws-tabs", WsTabs);
