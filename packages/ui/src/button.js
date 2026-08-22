import { html, LitElement } from "lit";

export class WsButton extends LitElement {
  /** @override */
  render() {
    return html`
      <button>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("ws-button", WsButton);
