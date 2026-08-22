/**
 * A trigger + content pair wired together via the native Popover API
 * (top-layer rendering, click-outside/Escape-to-close all come for free).
 * Position is computed once when it opens. No live repositioning while
 * open (e.g. on window resize) - a deliberate simplification for a
 * short-lived dropdown or context menu.
 *
 * Usage:
 *   <ui-popover>
 *     <button slot="trigger">Open</button>
 *     <ul>...</ul>
 *   </ui-popover>
 *
 * Set placement="right" to open beside the trigger instead of below it
 * (flipping to the left if there's no room) - used for nested submenus,
 * e.g. in ui-select-actions.
 *
 * No `ic` - unlike the other design-system components, a popover has no
 * data to represent, only a trigger/content pair to wire up.
 */

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: contents;
    }
    ::slotted([popover]) {
      margin: 0;
      padding: 4px;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      background: var(--color-surface);
      box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
      overflow-y: auto;
    }
  </style>
  <slot name="trigger"></slot>
  <slot></slot>
`;

const PADDING = 8;

class UiPopover extends HTMLElement {
  /** @type {HTMLElement|null} */
  #trigger = null;
  /** @type {HTMLElement|null} */
  #content = null;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    const slots = shadowRoot.querySelectorAll("slot");
    const triggerSlot = /** @type {HTMLSlotElement} */ (slots[0]);
    const contentSlot = /** @type {HTMLSlotElement} */ (slots[1]);

    triggerSlot.addEventListener("slotchange", () => {
      this.#trigger =
        /** @type {HTMLElement|undefined} */ (
          triggerSlot.assignedElements()[0]
        ) ?? null;
      this.#wireUp();
    });
    contentSlot.addEventListener("slotchange", () => {
      this.#content =
        /** @type {HTMLElement|undefined} */ (
          contentSlot.assignedElements()[0]
        ) ?? null;
      this.#wireUp();
    });
  }

  /** @override */
  hidePopover() {
    this.#content?.hidePopover();
  }

  #wireUp() {
    const trigger = this.#trigger;
    const content = this.#content;
    if (trigger === null || content === null) {
      return;
    }
    if (!(trigger instanceof HTMLButtonElement)) {
      console.error("ui-popover's trigger must be a <button>");
      return;
    }
    content.popover = "auto";
    trigger.popoverTargetElement = content;
    trigger.popoverTargetAction = "toggle";
    content.addEventListener("toggle", (e) => {
      if (e.newState === "open") {
        this.#position();
      }
    });
  }

  #position() {
    const trigger = this.#trigger;
    const content = this.#content;
    if (trigger === null || content === null) {
      return;
    }

    // Reset first: a leftover max-height from a previous open would clip
    // the measurement below.
    content.style.maxHeight = "none";

    const rect = trigger.getBoundingClientRect();
    const height = content.offsetHeight;
    const width = content.offsetWidth;

    if (this.getAttribute("placement") === "right") {
      this.#positionRight(rect, height, width);
      return;
    }

    const spaceBelow = window.innerHeight - rect.bottom - PADDING;
    const spaceAbove = rect.top - PADDING;
    const showBelow = spaceBelow >= height || spaceBelow >= spaceAbove;

    const left = Math.min(
      Math.max(rect.left, PADDING),
      window.innerWidth - width - PADDING,
    );
    content.style.left = `${left}px`;

    if (showBelow) {
      content.style.top = `${rect.bottom + PADDING}px`;
      content.style.maxHeight = `${Math.max(spaceBelow, 0)}px`;
    } else {
      content.style.top = `${Math.max(rect.top - height - PADDING, PADDING)}px`;
      content.style.maxHeight = `${Math.max(Math.min(height, spaceAbove), 0)}px`;
    }
  }

  /**
   * @param {DOMRect} rect
   * @param {number} height
   * @param {number} width
   */
  #positionRight(rect, height, width) {
    const content = this.#content;
    if (content === null) {
      return;
    }
    const spaceRight = window.innerWidth - rect.right - PADDING;
    const showRight = spaceRight >= width;
    content.style.left = showRight
      ? `${rect.right}px`
      : `${Math.max(rect.left - width, PADDING)}px`;

    const maxHeight = window.innerHeight - PADDING * 2;
    content.style.top = `${Math.max(
      Math.min(rect.top, window.innerHeight - height - PADDING),
      PADDING,
    )}px`;
    content.style.maxHeight = `${Math.max(Math.min(height, maxHeight), 0)}px`;
  }
}

customElements.define("ui-popover", UiPopover);

export { UiPopover };
