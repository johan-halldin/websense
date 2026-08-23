import { UiSelect } from "./select.wc.js";

/**
 * @typedef {import("./select.wc.js").SelectOption} SelectOption
 */

/** @type {SelectOption[]} */
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
  let singleValue = "apple";
  const single = new UiSelect();
  function renderSingle() {
    single.ic = {
      label: "Fruit",
      options: OPTIONS,
      selectedValues: [singleValue],
      onSelect: (value) => {
        singleValue = value;
        renderSingle();
      },
    };
  }
  renderSingle();
  root.appendChild(single);

  // Multi-select: onSelect toggles membership in the selection.
  let multiValues = ["apple", "cherry"];
  const multi = new UiSelect();
  function renderMulti() {
    multi.ic = {
      label: "Fruits",
      options: OPTIONS,
      selectedValues: multiValues,
      onSelect: (value) => {
        multiValues = multiValues.includes(value)
          ? multiValues.filter((v) => v !== value)
          : [...multiValues, value];
        renderMulti();
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
