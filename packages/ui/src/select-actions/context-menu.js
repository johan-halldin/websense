import { UiSelectActions } from "./select-actions.wc.js";

/** @import { SelectActionGroup } from "./select-actions.wc.js" */

/**
 * Opens the given nested actions as a context menu anchored at (x, y) -
 * typically a right-click's clientX/clientY. Reuses ui-select-actions for
 * rendering/positioning: its normal trigger button is shrunk to a single
 * point at (x, y) and clicked programmatically, so a right-click gets the
 * exact same menu, icons, and shortcut-key badges as a regular dropdown.
 * Resolves once the menu closes, whether by selecting a leaf action,
 * pressing Escape, or clicking outside.
 *
 * @param {SelectActionGroup[]} groups
 * @param {number} x
 * @param {number} y
 * @returns {Promise<void>}
 */
function async_context_menu(groups, x, y) {
  return new Promise((resolve) => {
    const menu = new UiSelectActions();
    menu.ic = { groups };
    menu.style.position = "fixed";
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    document.body.appendChild(menu);

    requestAnimationFrame(() => {
      const trigger = /** @type {HTMLButtonElement} */ (
        menu.shadowRoot?.querySelector("button")
      );
      trigger.style.width = "0";
      trigger.style.height = "0";
      trigger.style.padding = "0";
      trigger.style.border = "none";
      trigger.style.opacity = "0";

      const content = /** @type {HTMLElement} */ (
        menu.shadowRoot?.querySelector(".content")
      );
      content.addEventListener("toggle", (e) => {
        if (e.newState === "closed") {
          menu.remove();
          resolve();
        }
      });

      trigger.click();
    });
  });
}

export { async_context_menu };
