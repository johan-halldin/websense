import { UiSelectActions } from "./select-actions.wc.js";

/**
 * @typedef {import("./select-actions.wc.js").ISelectActions} ISelectActions
 */

/**
 * @param {HTMLElement} root
 */
function init_example_select_actions(root) {
  const menu = new UiSelectActions();
  /** @type {ISelectActions} */
  const ic = {
    label: "Actions",
    icon: "menu",
    groups: [
      {
        header: "Edit",
        actions: [
          {
            label: "Rename",
            icon: "pencil",
            onSelect: () => console.log("Rename"),
          },
          { label: "Copy", icon: "copy", onSelect: () => console.log("Copy") },
          { label: "Delete", icon: "trash-2" },
        ],
      },
      {
        header: "Share",
        actions: [
          {
            label: "Export",
            icon: "download",
            onSelect: () => console.log("Export"),
          },
        ],
      },
    ],
  };
  menu.ic = ic;
  root.appendChild(menu);

  const emptyMenu = new UiSelectActions();
  /** @type {ISelectActions} */
  const emptyIc = { label: "No actions", groups: [] };
  emptyMenu.ic = emptyIc;
  root.appendChild(emptyMenu);
}

export { init_example_select_actions };
