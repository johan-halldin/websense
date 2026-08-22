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
            type: "leaf",
            label: "Rename",
            icon: "pencil",
            onSelect: () => console.log("Rename"),
          },
          {
            type: "leaf",
            label: "Copy",
            icon: "copy",
            onSelect: () => console.log("Copy"),
          },
          { type: "leaf", label: "Delete", icon: "trash-2" },
        ],
      },
      {
        header: "Share",
        actions: [
          {
            type: "branch",
            label: "Export",
            icon: "download",
            children: [
              {
                actions: [
                  {
                    type: "leaf",
                    label: "Export as PDF",
                    onSelect: () => console.log("PDF"),
                  },
                  {
                    type: "leaf",
                    label: "Export as CSV",
                    onSelect: () => console.log("CSV"),
                  },
                ],
              },
            ],
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
