import { html, LitElement } from "lit";
import "@websense/ui/src/button/button.wc.js";
import "@websense/ui/src/checkbox/checkbox.wc.js";
import "@websense/ui/src/radio-group/radio-group.wc.js";
import "@websense/ui/src/tabs/tabs.wc.js";
import "../app/counter.wc.js";

/**
 * @typedef {import("@websense/ui/src/tabs/tabs.wc.js").ITabs} ITabs
 * @typedef {import("@websense/ui/src/button/button.wc.js").IButton} IButton
 * @typedef {import("@websense/ui/src/checkbox/checkbox.wc.js").ICheckbox} ICheckbox
 * @typedef {import("@websense/ui/src/radio-group/radio-group.wc.js").IRadioGroup} IRadioGroup
 * @typedef {import("../app/counter.wc.js").ICounter} ICounter
 */

/**
 * @typedef {object} IDashboard
 * @property {ITabs} tabs
 * @property {IButton} refreshButton
 * @property {IButton} exportButton
 * @property {ICounter} counter
 * @property {ICheckbox} advancedStatsCheckbox
 * @property {ICheckbox} notificationsCheckbox
 * @property {ICheckbox} darkModeCheckbox
 * @property {IRadioGroup} themeRadioGroup
 */

class WsDashboard extends LitElement {
  /**
   * Renders in light DOM (not shadow DOM) so this page's layout.css
   * utility classes (.ui-row, .ui-gap-md, etc.) apply directly - see
   * AGENTS.md.
   * @override
   */
  createRenderRoot() {
    return this;
  }

  /** @type {IDashboard|null} */
  #ic = null;

  /** @param {IDashboard} ic */
  set ic(ic) {
    this.#ic = ic;
    this.requestUpdate();
  }

  /** @override */
  render() {
    const ic = this.#ic;
    if (ic === null) {
      return "";
    }

    const activeTab = ic.tabs.value;

    return html`
      <div class="ui-stack ui-gap-lg ui-padding-lg">
        <h1>Dashboard</h1>
        <ui-tabs .ic=${ic.tabs}></ui-tabs>

        ${
          activeTab === "overview"
            ? html`
                <div class="ui-stack ui-gap-md">
                  <div class="ui-row ui-gap-sm">
                    <ui-button .ic=${ic.refreshButton}></ui-button>
                    <ui-button .ic=${ic.exportButton}></ui-button>
                  </div>
                  <div class="ui-row ui-align-center ui-gap-sm">
                    <span>Widgets:</span>
                    <ws-counter .ic=${ic.counter}></ws-counter>
                  </div>
                  <ui-checkbox .ic=${ic.advancedStatsCheckbox}></ui-checkbox>
                  ${
                    ic.advancedStatsCheckbox.checked
                      ? html`<p>Advanced stat: p99 latency 42ms</p>`
                      : ""
                  }
                </div>
              `
            : ""
        }
        ${
          activeTab === "settings"
            ? html`
                <div class="ui-stack ui-gap-md">
                  <ui-checkbox .ic=${ic.notificationsCheckbox}></ui-checkbox>
                  <ui-checkbox .ic=${ic.darkModeCheckbox}></ui-checkbox>
                  <ui-radio-group .ic=${ic.themeRadioGroup}></ui-radio-group>
                </div>
              `
            : ""
        }
        ${activeTab === "users" ? html`<p>User management coming soon.</p>` : ""}
      </div>
    `;
  }
}

customElements.define("ws-dashboard", WsDashboard);

export { WsDashboard };
