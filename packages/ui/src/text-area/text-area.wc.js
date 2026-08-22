import { css, html, LitElement } from "lit";

/**
 * @typedef {object} ITextArea
 * @property {string} value
 * @property {string} [label]
 * @property {string} [placeholder]
 * @property {string} [tooltip]
 * @property {number} [rows]
 * @property {(value: string) => void} [onInput]
 */

export class UiTextArea extends LitElement {
  /** @override */
  static styles = css`
    label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font: inherit;
      font-size: 14px;
      color: var(--color-text);
    }
    textarea {
      padding: 6px 8px;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font: inherit;
      color: var(--color-text);
      background-color: var(--color-surface);
      resize: vertical;
    }
    textarea:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: -1px;
    }
    textarea:disabled {
      cursor: default;
      opacity: 0.5;
      resize: none;
    }
  `;

  /** @type {ITextArea|null} */
  #ic = null;

  /** @param {ITextArea} ic */
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

    return html`
      <label title=${ic.tooltip ?? ""}>
        ${ic.label ?? ""}
        <textarea
          .value=${ic.value}
          placeholder=${ic.placeholder ?? ""}
          rows=${ic.rows ?? 3}
          ?disabled=${disabled}
          @input=${(/** @type {Event} */ e) =>
            ic.onInput?.(/** @type {HTMLTextAreaElement} */ (e.target).value)}
        ></textarea>
      </label>
    `;
  }
}

customElements.define("ui-text-area", UiTextArea);
