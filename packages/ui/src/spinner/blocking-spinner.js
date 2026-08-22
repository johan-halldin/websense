import { UiSpinner } from "./spinner.wc.js";

/**
 * Shows a blocking spinner overlay for the duration of `promise`, then
 * removes it. Mirrors async_confirm's "one call, no manual mount/unmount"
 * shape.
 *
 * @template T
 * @param {Promise<T>} promise
 * @param {string} [label]
 * @returns {Promise<T>}
 */
async function with_blocking_spinner(promise, label) {
  const spinner = new UiSpinner();
  spinner.ic = label !== undefined ? { label } : {};
  document.body.appendChild(spinner);
  try {
    return await promise;
  } finally {
    spinner.remove();
  }
}

export { with_blocking_spinner };
