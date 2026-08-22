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

  const group = new UiRadioGroup();
  group.ic = {
    value: "medium",
    options,
    onChange: (value) => {
      console.log("Changed", value);
      group.ic = { ...group.ic, value };
    },
  };
  root.appendChild(group);

  const disabledGroup = new UiRadioGroup();
  disabledGroup.ic = { value: "medium", options };
  root.appendChild(disabledGroup);
}

export { init_example_radio_group };
