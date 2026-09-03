import { css, html, LitElement } from "lit";

/**
 * @typedef {object} SegmentedControlOption
 * @property {string} value
 * @property {string} [label]
 * @property {string} [tooltip]
 */

/**
 * @typedef {object} ISegmentedControl
 * @property {string} value
 * @property {SegmentedControlOption[]} options
 * @property {(value: string) => void} [onChange]
 */

class UiSegmentedControl extends LitElement {
  /** @override */
  static styles = css`
    #container {
      display: inline-flex;
      overflow: hidden;
      border: 1px solid var(--color-border);
      border-radius: 4px;
    }
    button {
      min-width: 0;
      height: 32px;
      padding: 0 12px;
      font: inherit;
      font-size: 14px;
      color: var(--color-text);
      background-color: var(--color-surface);
      border: none;
      cursor: pointer;
    }
    button + button {
      border-left: 1px solid var(--color-border);
    }
    button:hover:not(:disabled, .active) {
      background-color: var(--color-background);
    }
    button.active {
      color: var(--color-on-primary);
      background-color: var(--color-primary);
    }
    button.active:hover:not(:disabled) {
      background-color: var(--color-primary-hover);
    }
    button:focus-visible {
      position: relative;
      outline: 2px solid var(--color-primary);
      outline-offset: -2px;
    }
    button:disabled {
      cursor: default;
      opacity: 0.5;
    }
  `;

  /** @type {ISegmentedControl|null} */
  #ic = null;

  /** @param {ISegmentedControl} ic */
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
        ${ic.options.map((option) => {
          const active = option.value === ic.value;
          return html`
            <button
              class=${active ? "active" : ""}
              aria-pressed=${active ? "true" : "false"}
              ?disabled=${disabled}
              title=${option.tooltip ?? ""}
              @click=${() => {
                if (!active) {
                  onChange?.(option.value);
                }
              }}
            >
              ${option.label ?? option.value}
            </button>
          `;
        })}
      </div>
    `;
  }
}

customElements.define("ui-segmented-control", UiSegmentedControl);

export { UiSegmentedControl };
