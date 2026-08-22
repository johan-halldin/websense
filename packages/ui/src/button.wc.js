import { html, LitElement } from "lit";

/**
 * @typedef {object} IButton
 * @property {string} [title]
 * @property {(e: MouseEvent) => void} [onClick]
 */

export class WsButton extends LitElement {
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
