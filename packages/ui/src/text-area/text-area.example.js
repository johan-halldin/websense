import { UiTextArea } from "./text-area.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_text_area(root) {
  let notes = "";
  const textArea = new UiTextArea();
  function render() {
    textArea.ic = {
      label: "Notes",
      placeholder: "Write something...",
      rows: 4,
      value: notes,
      onInput: (value) => {
        notes = value;
        render();
      },
    };
  }
  render();
  root.appendChild(textArea);

  const disabledTextArea = new UiTextArea();
  disabledTextArea.ic = {
    label: "Disabled",
    value: "Can't edit this",
  };
  root.appendChild(disabledTextArea);
}

export { init_example_text_area };
