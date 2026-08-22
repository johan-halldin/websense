import { capitalize } from "@websense/util";
import { WsAppView } from "./app.wc.js";

/**
 * @typedef {import("./app.wc.js").IAppView} IAppView
 */

class App {
  /** @type {WsAppView} */
  #view = new WsAppView();
  /** @type {string} */
  #status = "checking...";
  /** @type {number|null} */
  #renderTimer = null;

  async init() {
    await this.#checkHealth();
  }

  /** @returns {HTMLElement} */
  get_element() {
    return this.#view;
  }

  render() {
    this.#do_render();
  }

  async #checkHealth() {
    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      this.#status = data.status;
    } catch {
      this.#status = "unreachable";
    }
    this.#render();
  }

  /** @returns {IAppView} */
  #getIAppView() {
    return {
      status: capitalize(this.#status),
      onRefresh: () => this.#checkHealth(),
    };
  }

  #do_render() {
    this.#view.ic = this.#getIAppView();
  }

  #render() {
    if (this.#renderTimer !== null) {
      return;
    }
    const delay = 2;
    this.#renderTimer = window.setTimeout(() => {
      this.#renderTimer = null;
      this.#do_render();
    }, delay);
  }
}

/**
 * @param {HTMLElement} root
 * @returns {Promise<App>}
 */
async function init_app(root) {
  const app = new App();
  await app.init();
  const el = app.get_element();
  root.appendChild(el);
  app.render();
  return app;
}

export { App, init_app };
