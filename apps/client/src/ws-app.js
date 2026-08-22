import { html, LitElement } from "lit";
import "@websense/ui/src/button.js";

export class WsApp extends LitElement {
  static properties = {
    status: { state: true },
  };

  constructor() {
    super();
    this.status = "checking...";
  }

  connectedCallback() {
    super.connectedCallback();
    this.checkHealth();
  }

  async checkHealth() {
    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      this.status = data.status;
    } catch {
      this.status = "unreachable";
    }
  }

  render() {
    return html`
      <h1>WebSense</h1>
      <p>Server status: ${this.status}</p>
      <ws-button @click=${() => this.checkHealth()}>Refresh</ws-button>
    `;
  }
}

customElements.define("ws-app", WsApp);
