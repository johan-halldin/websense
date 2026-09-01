import { UiToast } from "./toast.wc.js";
import { UiToastStack } from "./toast-stack.wc.js";

/** @import { IconName } from "../icons/icon-types.js" */

/** @type {UiToastStack|null} */
let stack = null;

function get_stack() {
  if (stack === null) {
    stack = new UiToastStack();
    document.body.appendChild(stack);
  }
  return stack;
}

/**
 * @typedef {object} ShowToastOptions
 * @property {"info"|"success"|"warning"|"error"} [level]
 * @property {IconName} [icon] - defaults to an icon matching `level`
 * @property {number|null} [duration] - ms before auto-dismiss, default
 *   4000. null means it stays until the user clicks it (no auto-dismiss).
 */

/**
 * Shows a non-blocking toast that stacks above any others currently
 * visible, and auto-dismisses after `duration`. Clicking a toast dismisses
 * it early.
 *
 * @param {string} message
 * @param {ShowToastOptions} [options]
 */
function show_toast(message, options = {}) {
  const toast = new UiToast();
  const dismiss = () => toast.remove();
  const duration = options.duration === undefined ? 4000 : options.duration;

  toast.ic = {
    message,
    ...(options.level !== undefined ? { level: options.level } : {}),
    ...(options.icon !== undefined ? { icon: options.icon } : {}),
    onDismiss: dismiss,
  };

  get_stack().appendChild(toast);
  if (duration !== null) {
    setTimeout(dismiss, duration);
  }
}

export { show_toast };
