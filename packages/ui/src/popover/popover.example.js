import "./popover.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_popover(root) {
  const dropdown = document.createElement("ui-popover");
  dropdown.innerHTML = `
    <button slot="trigger">Select a fruit</button>
    <ul>
      <li>Apple</li>
      <li>Banana</li>
      <li>Cherry</li>
    </ul>
  `;
  root.appendChild(dropdown);

  const menu = document.createElement("ui-popover");
  menu.innerHTML = `
    <button slot="trigger">Right-click style menu</button>
    <ul>
      <li>Cut</li>
      <li>Copy</li>
      <li>Paste</li>
    </ul>
  `;
  root.appendChild(menu);
}

export { init_example_popover };
