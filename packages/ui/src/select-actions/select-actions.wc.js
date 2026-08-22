import { css, html, LitElement } from "lit";
import { iconBaseStyle } from "../icons/icon-styles.js";
import "../popover/popover.wc.js";

/**
 * @typedef {import("../icons/icon-types.js").IconName} IconName
 */

/**
 * @typedef {object} ISelectAction
 * @property {string} label
 * @property {string} [tooltip]
 * @property {IconName} [icon]
 * @property {() => void} [onSelect]
 */

/**
 * @typedef {object} ISelectActionGroup
 * @property {string} [header]
 * @property {ISelectAction[]} actions
 */

/**
 * @typedef {object} ISelectActions
 * @property {string} [label]
 * @property {string} [tooltip]
 * @property {IconName} [icon]
 * @property {ISelectActionGroup[]} groups
 */

export class UiSelectActions extends LitElement {
  /** @override */
  static styles = [
    iconBaseStyle,
    css`
      button {
        display: inline-flex;
        align-items: center;
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
      button:disabled {
        cursor: default;
        opacity: 0.5;
      }
      .content {
        min-width: 160px;
      }
      .group + .group {
        margin-top: 6px;
        padding-top: 6px;
        border-top: 1px solid var(--color-border);
      }
      .header {
        padding: 4px 8px;
        font-size: 11px;
        font-weight: 600;
        color: var(--color-text-muted);
        text-transform: uppercase;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 8px;
        border-radius: 4px;
        font-size: 14px;
        color: var(--color-text);
        cursor: pointer;
      }
      li:hover:not(.disabled) {
        background: var(--color-background);
      }
      li.disabled {
        cursor: default;
        opacity: 0.5;
      }
    `,
  ];

  /** @type {ISelectActions|null} */
  #ic = null;

  /** @param {ISelectActions} ic */
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
    const disabled = ic.groups.length === 0;
    const icon = ic.icon ?? "menu";

    return html`
      <ui-popover>
        <button
          slot="trigger"
          ?disabled=${disabled}
          title=${ic.tooltip ?? ic.label ?? ""}
        >
          ${ic.label ?? ""}
          <span
            class="icon"
            style="mask-image: var(--icon-${icon}); -webkit-mask-image: var(--icon-${icon});"
          ></span>
        </button>
        <div class="content">
          ${ic.groups.map(
            (group) => html`
              <div class="group">
                ${
                  group.header !== undefined
                    ? html`<div class="header">${group.header}</div>`
                    : ""
                }
                <ul>
                  ${group.actions.map((action) => {
                    const actionDisabled = action.onSelect === undefined;
                    return html`
                      <li
                        class=${actionDisabled ? "disabled" : ""}
                        title=${action.tooltip ?? action.label}
                        @click=${() => {
                          action.onSelect?.();
                          this.#hidePopover();
                        }}
                      >
                        ${
                          action.icon !== undefined
                            ? html`<span
                                class="icon"
                                style="mask-image: var(--icon-${action.icon}); -webkit-mask-image: var(--icon-${action.icon});"
                              ></span>`
                            : ""
                        }
                        ${action.label}
                      </li>
                    `;
                  })}
                </ul>
              </div>
            `,
          )}
        </div>
      </ui-popover>
    `;
  }

  #hidePopover() {
    const popover =
      /** @type {import("../popover/popover.wc.js").UiPopover|null} */ (
        this.shadowRoot?.querySelector("ui-popover") ?? null
      );
    popover?.hidePopover();
  }
}

customElements.define("ui-select-actions", UiSelectActions);
