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

  let bio = "";
  const validatedTextArea = new UiTextArea();
  function renderValidated() {
    validatedTextArea.ic = {
      label: "Bio",
      placeholder: "Tell us about yourself",
      rows: 3,
      value: bio,
      ...(bio.length > 140 ? { error: "Must be 140 characters or fewer" } : {}),
      onInput: (value) => {
        bio = value;
        renderValidated();
      },
    };
  }
  renderValidated();
  root.appendChild(validatedTextArea);

  const disabledTextArea = new UiTextArea();
  disabledTextArea.ic = {
    label: "Disabled",
    value: "Can't edit this",
  };
  root.appendChild(disabledTextArea);
}

export { init_example_text_area };
