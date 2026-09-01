import { UiSlider } from "./slider.wc.js";

/**
 * @param {HTMLElement} root
 */
function init_example_slider(root) {
  let volume = 40;
  const defaultSlider = new UiSlider();
  function renderDefaultSlider() {
    defaultSlider.ic = {
      label: "Volume",
      value: volume,
      onInput: (value) => {
        console.log("Volume:", value);
        volume = value;
        renderDefaultSlider();
      },
    };
  }
  renderDefaultSlider();
  root.appendChild(defaultSlider);

  let brightness = 5;
  const rangedSlider = new UiSlider();
  function renderRangedSlider() {
    rangedSlider.ic = {
      label: "Brightness",
      value: brightness,
      min: 1,
      max: 10,
      step: 1,
      onInput: (value) => {
        console.log("Brightness:", value);
        brightness = value;
        renderRangedSlider();
      },
    };
  }
  renderRangedSlider();
  root.appendChild(rangedSlider);

  const disabledSlider = new UiSlider();
  disabledSlider.ic = { label: "Disabled", value: 20 };
  root.appendChild(disabledSlider);
}

export { init_example_slider };
