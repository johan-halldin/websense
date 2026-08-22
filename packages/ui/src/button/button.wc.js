import { css, html, LitElement } from "lit";

/**
 * @typedef {object} IButton
 * @property {string} [title]
 * @property {(e: MouseEvent) => void} [onClick]
 */

export class WsButton extends LitElement {
  /** @override */
  static styles = css`
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      padding: 0 12px;
      font: inherit;
      font-size: 14px;
      color: var(--color-text);
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 6px;
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
  `;

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
    const title = ic?.title ?? "";
    const onClick = ic?.onClick;
    const disabled = onClick === undefined;

    return html`
      <button
        ?disabled=${disabled}
        @click=${(/** @type {MouseEvent} */ e) => onClick?.(e)}
      >
        ${title}
      </button>
    `;
  }
}

customElements.define("ws-button", WsButton);
