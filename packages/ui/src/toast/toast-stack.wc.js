/**
 * A singleton, fixed-position container that stacks <ui-toast> elements
 * above one another instead of letting them overlap - new toasts are
 * appended and, via column-reverse, land closest to the corner while older
 * ones get pushed up. Created lazily by show_toast() in toast.js; not meant
 * to be instantiated directly.
 */

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      position: fixed;
      right: 16px;
      bottom: 16px;
      display: flex;
      flex-direction: column-reverse;
      gap: 8px;
      z-index: 2000;
      pointer-events: none;
    }
    ::slotted(*) {
      pointer-events: auto;
    }
  </style>
  <slot></slot>
`;

class UiToastStack extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("ui-toast-stack", UiToastStack);

export { UiToastStack };
