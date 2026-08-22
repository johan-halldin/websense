import { UiToast } from "./toast.wc.js";
import { UiToastStack } from "./toast-stack.wc.js";

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
 * @typedef {object} IShowToastOptions
 * @property {"info"|"success"|"error"} [tone]
 * @property {number} [duration] - ms before auto-dismiss, default 4000
 */

/**
 * Shows a non-blocking toast that stacks above any others currently
 * visible, and auto-dismisses after `duration`. Clicking a toast dismisses
 * it early.
 *
 * @param {string} message
 * @param {IShowToastOptions} [options]
 */
function show_toast(message, options = {}) {
  const toast = new UiToast();
  const dismiss = () => toast.remove();

  toast.ic = {
    message,
    ...(options.tone !== undefined ? { tone: options.tone } : {}),
    onDismiss: dismiss,
  };

  get_stack().appendChild(toast);
  setTimeout(dismiss, options.duration ?? 4000);
}

export { show_toast };
