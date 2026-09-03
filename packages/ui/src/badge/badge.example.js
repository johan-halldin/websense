import { UiBadge } from "./badge.wc.js";

/** @import { IBadge } from "./badge.wc.js" */

/**
 * @param {HTMLElement} root
 */
function init_example_badge(root) {
  /** @type {IBadge[]} */
  const badges = [
    { label: "Default" },
    {
      label: "Primary",
      backgroundColor: "var(--color-primary)",
      textColor: "var(--color-on-primary)",
    },
    {
      label: "Healthy",
      icon: "circle-check",
      backgroundColor: "var(--color-success)",
      textColor: "var(--color-on-success)",
    },
    {
      label: "Failed",
      icon: "circle-alert",
      size: "sm",
      backgroundColor: "var(--color-error)",
      textColor: "var(--color-on-error)",
    },
    {
      label: "Pending",
      icon: "clock",
      size: "lg",
      backgroundColor: "var(--color-warning)",
      textColor: "var(--color-on-warning)",
    },
  ];

  for (const ic of badges) {
    const badge = new UiBadge();
    badge.ic = ic;
    root.appendChild(badge);
  }

  const customBadge = new UiBadge();
  customBadge.ic = {
    label: "Custom",
    icon: "mesh",
    backgroundColor: "var(--color-primary-100)",
    textColor: "var(--color-primary)",
    iconColor: "var(--color-primary-600)",
  };
  root.appendChild(customBadge);
}

export { init_example_badge };
