import { css, html, LitElement } from "lit";

/**
 * @typedef {object} IToast
 * @property {string} message
 * @property {"info"|"success"|"error"} [tone]
 * @property {() => void} [onDismiss]
 */

export class UiToast extends LitElement {
  /** @override */
  static styles = css`
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
    }
    .toast.error {
      border-left-color: var(--color-error);
    }
  `;

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

    return html`
      <div class="toast ${ic.tone ?? ""}" @click=${() => ic.onDismiss?.()}>
        ${ic.message}
      </div>
    `;
  }
}

customElements.define("ui-toast", UiToast);
