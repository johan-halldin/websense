/**
 * A full-viewport overlay that blocks all interaction while shown - for
 * long-running operations with no partial-progress UI to display. Not
 * dismissible by design (no backdrop click, no Escape) - callers control it
 * entirely via mount/remove, typically through with_blocking_spinner() in
 * blocking-spinner.js.
 *
 * Usage:
 *   const spinner = new UiSpinner();
 *   spinner.ic = { label: "Loading..." };
 *   document.body.appendChild(spinner);
 *   ...
 *   spinner.remove();
 */

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: rgb(0 0 0 / 0.4);
      z-index: 1000;
    }
    .ring {
      width: 32px;
      height: 32px;
      border: 3px solid rgb(255 255 255 / 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    span {
      font: inherit;
      font-size: 14px;
      color: #fff;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  </style>
  <div class="ring"></div>
  <span></span>
`;

/**
 * @typedef {object} ISpinner
 * @property {string} [label]
 */

class UiSpinner extends HTMLElement {
  /** @type {HTMLSpanElement} */
  #label;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.#label = /** @type {HTMLSpanElement} */ (
      shadowRoot.querySelector("span")
    );
  }

  /** @param {ISpinner} ic */
  set ic(ic) {
    this.#label.textContent = ic.label ?? "";
  }
}

customElements.define("ui-spinner", UiSpinner);

export { UiSpinner };
