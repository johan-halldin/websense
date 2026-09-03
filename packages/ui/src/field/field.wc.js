import { css, html, LitElement } from "lit";

/**
 * @typedef {object} IField
 * @property {string} label
 * @property {string} [description]
 * @property {string} [error]
 */

/**
 * Groups one or more related controls under a shared label. The controls are
 * provided through the default slot and retain ownership of their state and
 * interactions.
 */
class UiField extends LitElement {
  /** @override */
  static styles = css`
    :host {
      display: block;
    }
    fieldset {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      min-width: 0;
      margin: 0;
      padding: 0;
      border: none;
      font: inherit;
      color: var(--color-text);
    }
    legend {
      margin: 0 0 var(--space-xs);
      padding: 0;
      font-size: 14px;
    }
    .description,
    .error {
      font-size: 12px;
    }
    .description {
      color: var(--color-text-muted);
    }
    .error {
      color: var(--color-error);
    }
  `;

  /** @type {IField|null} */
  #ic = null;

  /** @param {IField} ic */
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
    const descriptionId = ic.description !== undefined ? "description" : null;
    const errorId = ic.error !== undefined ? "error" : null;
    const describedBy = [descriptionId, errorId].filter(Boolean).join(" ");

    return html`
      <fieldset
        part="field"
        ?aria-invalid=${ic.error !== undefined}
        aria-describedby=${describedBy || undefined}
      >
        <legend part="label">${ic.label}</legend>
        <slot></slot>
        ${
          ic.description !== undefined
            ? html`<div id="description" class="description" part="description">
                ${ic.description}
              </div>`
            : ""
        }
        ${
          ic.error !== undefined
            ? html`<div
                id="error"
                class="error"
                part="error"
                aria-live="polite"
              >
                ${ic.error}
              </div>`
            : ""
        }
      </fieldset>
    `;
  }
}

customElements.define("ui-field", UiField);

export { UiField };
