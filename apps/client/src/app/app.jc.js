import { Dashboard } from "../dashboard/dashboard.jc.js";
import { WsAppView } from "./app.wc.js";

/**
 * @typedef {import("./app.wc.js").IAppView} IAppView
 */

class App {
  /** @type {WsAppView} */
  #view = new WsAppView();
  /** @type {number|null} */
  #renderTimer = null;
  /** @type {Dashboard} */
  #dashboard = new Dashboard(() => this.#render());

  /** @returns {HTMLElement} */
  get_element() {
    return this.#view;
  }

  render() {
    this.#do_render();
  }

  /** @returns {IAppView} */
  #getIAppView() {
    return {
      dashboard: this.#dashboard.getIDashboard(),
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
 * @returns {App}
 */
function init_app(root) {
  const app = new App();
  const el = app.get_element();
  root.appendChild(el);
  app.render();
  return app;
}

export { App, init_app };
