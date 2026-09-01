import { css, html, LitElement } from "lit";
import { iconBaseStyle } from "../icons/icon-styles.js";
import "../popover/popover.wc.js";

/**
 * @typedef {object} SelectOption
 * @property {string} value
 * @property {string} label
 * @property {string} [tooltip]
 */

/**
 * @typedef {object} ISelect
 * @property {string} [label]
 * @property {string} [tooltip]
 * @property {string[]} selectedValues
 * @property {SelectOption[]} options
 * @property {(value: string) => void} [onSelect]
 */

/**
 * Single- and multi-select share this same component - the only difference
 * is what the consumer's onSelect does with the value (replace the
 * selection vs. toggle membership in it), which is state-owning logic that
 * lives outside this component. See AGENTS.md.
 */
class UiSelect extends LitElement {
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
      li:hover {
        background: var(--color-background);
      }
      li .icon {
        visibility: hidden;
      }
      li.selected .icon {
        visibility: visible;
      }
    `,
  ];

  /** @type {ISelect|null} */
  #ic = null;

  /** @param {ISelect} ic */
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
    const disabled = ic.onSelect === undefined;
    const triggerLabel = getTriggerLabel(ic);

    return html`
      <ui-popover>
        <button
          slot="trigger"
          ?disabled=${disabled}
          title=${ic.tooltip ?? ic.label ?? ""}
        >
          ${triggerLabel ?? ""}
          <span
            class="icon"
            style="mask-image: var(--icon-chevron-down); -webkit-mask-image: var(--icon-chevron-down);"
          ></span>
        </button>
        <div class="content">
          <ul>
            ${ic.options.map((option) => {
              const isSelected = ic.selectedValues.includes(option.value);
              return html`
                <li
                  class=${isSelected ? "selected" : ""}
                  title=${option.tooltip ?? option.label}
                  @click=${() => ic.onSelect?.(option.value)}
                >
                  <span
                    class="icon"
                    style="mask-image: var(--icon-check); -webkit-mask-image: var(--icon-check);"
                  ></span>
                  ${option.label}
                </li>
              `;
            })}
          </ul>
        </div>
      </ui-popover>
    `;
  }
}

/**
 * @param {ISelect} ic
 * @returns {string|undefined}
 */
function getTriggerLabel(ic) {
  if (ic.label === undefined) {
    return undefined;
  }
  const count = ic.selectedValues.length;
  if (count === 0) {
    return `${ic.label}: —`;
  }
  if (count > 1) {
    return `${ic.label}: (${count})`;
  }
  const selectedValue = ic.selectedValues[0];
  const selectedOption = ic.options.find(
    (option) => option.value === selectedValue,
  );
  return `${ic.label}: ${selectedOption?.label ?? "—"}`;
}

customElements.define("ui-select", UiSelect);

export { UiSelect };
