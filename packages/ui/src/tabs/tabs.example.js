import { WsTabs } from "./tabs.wc.js";

/**
 * @typedef {import("./tabs.wc.js").ITabOption} ITabOption
 */

/** @type {Record<string, string>} */
const CONTENT_BY_VALUE = {
  overview: "This is the overview panel.",
  settings: "This is the settings panel.",
  users: "This is the users panel.",
};

/**
 * @param {HTMLElement} root
 */
function init_example_tabs(root) {
  /** @type {ITabOption[]} */
  const options = [
    { value: "overview", label: "Overview", icon: "house" },
    { value: "settings", label: "Settings", icon: "settings" },
    { value: "users", label: "Users", icon: "user", tooltip: "Manage users" },
  ];

  let value = "overview";

  const tabsElement = new WsTabs();

  const content = document.createElement("p");

  function render() {
    tabsElement.ic = {
      value,
      options,
      onChange: (newValue) => {
        value = newValue;
        render();
      },
    };
    content.textContent = CONTENT_BY_VALUE[value] ?? "";
  }
  render();

  root.appendChild(tabsElement);
  root.appendChild(content);

  const disabledTabs = new WsTabs();
  disabledTabs.ic = { value: "overview", options };
  root.appendChild(disabledTabs);
}

export { init_example_tabs };
