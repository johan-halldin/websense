import { html, LitElement } from "lit";

export class WsButton extends LitElement {
	render() {
		return html`
            <button>
                <slot></slot>
            </button>
        `;
	}
}

customElements.define("ws-button", WsButton);
