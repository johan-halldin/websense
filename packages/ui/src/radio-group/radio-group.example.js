import { UiRadioGroup } from "./radio-group.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_radio_group(root) {
  const options = [
    { value: "small", label: "Small", tooltip: "Compact size" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large", tooltip: "Spacious size" },
  ];

  let value = "medium";

  const group = new UiRadioGroup();
  function render() {
    group.ic = {
      value,
      options,
      onChange: (newValue) => {
        console.log("Changed", newValue);
        value = newValue;
        render();
      },
    };
  }
  render();
  root.appendChild(group);

  const disabledGroup = new UiRadioGroup();
  disabledGroup.ic = { value: "medium", options };
  root.appendChild(disabledGroup);
}

export { init_example_radio_group };
