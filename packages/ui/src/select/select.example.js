import { UiSelect } from "./select.wc.js";

/**
 * @typedef {import("./select.wc.js").ISelectOption} ISelectOption
 */

/** @type {ISelectOption[]} */
const OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

/**
 * @param {HTMLElement} root
 */
function init_example_select(root) {
  // Single-select: onSelect replaces the whole selection.
  const single = new UiSelect();
  function renderSingle() {
    single.ic = {
      label: "Fruit",
      options: OPTIONS,
      selectedValues: single.ic?.selectedValues ?? ["apple"],
      onSelect: (value) => {
        single.ic = { ...single.ic, selectedValues: [value] };
      },
    };
  }
  renderSingle();
  root.appendChild(single);

  // Multi-select: onSelect toggles membership in the selection.
  const multi = new UiSelect();
  function renderMulti() {
    const current = multi.ic?.selectedValues ?? ["apple", "cherry"];
    multi.ic = {
      label: "Fruits",
      options: OPTIONS,
      selectedValues: current,
      onSelect: (value) => {
        const selected = multi.ic?.selectedValues ?? [];
        const next = selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value];
        multi.ic = { ...multi.ic, selectedValues: next };
      },
    };
  }
  renderMulti();
  root.appendChild(multi);

  const disabledSelect = new UiSelect();
  disabledSelect.ic = {
    label: "Fruit",
    options: OPTIONS,
    selectedValues: [],
  };
  root.appendChild(disabledSelect);
}

export { init_example_select };
