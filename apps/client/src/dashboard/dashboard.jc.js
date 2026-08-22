import { Counter } from "../app/counter.jc.js";

/**
 * @typedef {import("./dashboard.wc.js").IDashboard} IDashboard
 */

/** @type {{value: string, label: string}[]} */
const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

class Dashboard {
  /** @type {() => void} */
  #on_change;
  /** @type {Counter} */
  #counter;
  /** @type {string} */
  #activeTab = "overview";
  /** @type {boolean} */
  #showAdvancedStats = false;
  /** @type {boolean} */
  #notifications = true;
  /** @type {boolean} */
  #darkMode = false;
  /** @type {string} */
  #theme = "system";

  /** @param {() => void} on_change */
  constructor(on_change) {
    this.#on_change = on_change;
    this.#counter = new Counter(on_change);
  }

  /** @returns {IDashboard} */
  getIDashboard() {
    return {
      tabs: {
        value: this.#activeTab,
        options: [
          { value: "overview", label: "Overview", icon: "house" },
          { value: "settings", label: "Settings", icon: "settings" },
          { value: "users", label: "Users", icon: "user" },
        ],
        onChange: (value) => {
          this.#activeTab = value;
          this.#on_change();
        },
      },
      refreshButton: {
        label: "Refresh",
        icon: "refresh-cw",
        onClick: () => this.#on_change(),
      },
      exportButton: {
        label: "Export",
        icon: "download",
        onClick: () => console.log("Export clicked"),
      },
      counter: this.#counter.getICounter(),
      advancedStatsCheckbox: {
        checked: this.#showAdvancedStats,
        label: "Show advanced stats",
        onChange: (checked) => {
          this.#showAdvancedStats = checked;
          this.#on_change();
        },
      },
      notificationsCheckbox: {
        checked: this.#notifications,
        label: "Enable notifications",
        onChange: (checked) => {
          this.#notifications = checked;
          this.#on_change();
        },
      },
      darkModeCheckbox: {
        checked: this.#darkMode,
        label: "Enable dark mode",
        onChange: (checked) => {
          this.#darkMode = checked;
          this.#on_change();
        },
      },
      themeRadioGroup: {
        value: this.#theme,
        options: THEME_OPTIONS,
        onChange: (value) => {
          this.#theme = value;
          this.#on_change();
        },
      },
    };
  }
}

export { Dashboard };
