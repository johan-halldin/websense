import { async_context_menu } from "./context-menu.js";
import { UiSelectActions } from "./select-actions.wc.js";

/** @import { ISelectActions, SelectActionGroup } from "./select-actions.wc.js" */

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
            shortcutKeys: ["⌘", "R"],
            onSelect: () => console.log("Rename"),
          },
          {
            type: "leaf",
            label: "Copy",
            icon: "copy",
            shortcutKeys: ["⌘", "C"],
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

  /** @type {SelectActionGroup[]} */
  const contextMenuGroups = [
    {
      actions: [
        {
          type: "leaf",
          label: "Rename",
          icon: "pencil",
          shortcutKeys: ["⌘", "R"],
          onSelect: () => console.log("Rename"),
        },
        {
          type: "leaf",
          label: "Delete",
          icon: "trash-2",
          onSelect: () => console.log("Delete"),
        },
      ],
    },
  ];
  const contextMenuArea = document.createElement("div");
  contextMenuArea.textContent = "Right-click here for a context menu";
  contextMenuArea.style.padding = "24px";
  contextMenuArea.style.border = "1px dashed var(--color-border)";
  contextMenuArea.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    async_context_menu(contextMenuGroups, e.clientX, e.clientY);
  });
  root.appendChild(contextMenuArea);
}

export { init_example_select_actions };
