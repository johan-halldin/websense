import { JcDashboard } from "../dashboard/dashboard.jc.js";
import { WsAppView } from "./app.wc.js";

/** @import { IAppView } from "./app.wc.js" */

class JcApp {
  /** @type {WsAppView} */
  #view = new WsAppView();
  /** @type {number|null} */
  #renderTimer = null;
  /** @type {JcDashboard} */
  #dashboard = new JcDashboard(() => this.#render());

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
 * @returns {JcApp}
 */
function init_app(root) {
  const app = new JcApp();
  const el = app.get_element();
  root.appendChild(el);
  app.render();
  return app;
}

export { JcApp, init_app };
