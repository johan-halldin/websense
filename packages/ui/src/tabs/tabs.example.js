import { WsTabs } from "./tabs.wc.js";

/**
 * @typedef {import("./tabs.wc.js").ITabOption} ITabOption
 */

/**
 * @param {HTMLElement} root
 */
function init_example_tabs(root) {
  /** @type {ITabOption[]} */
  const tabs = [
    { value: "overview", label: "Overview", icon: "house" },
    { value: "settings", label: "Settings", icon: "settings" },
    { value: "users", label: "Users", icon: "user", tooltip: "Manage users" },
  ];

  const tabsElement = new WsTabs();
  tabsElement.ic = {
    activeValue: "overview",
    tabs,
    onChange: (value) => {
      console.log("Changed", value);
      tabsElement.ic = { ...tabsElement.ic, activeValue: value };
    },
  };
  root.appendChild(tabsElement);

  const disabledTabs = new WsTabs();
  disabledTabs.ic = { activeValue: "overview", tabs };
  root.appendChild(disabledTabs);
}

export { init_example_tabs };
