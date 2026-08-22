import { css } from "lit";

/**
 * Base icon sizing/color mechanics for components rendering an icon inside
 * their own shadow root. The per-icon shapes themselves come from the
 * --icon-<name> custom properties defined in icons.css, which (unlike the
 * .icon.<name> classes there) inherit through shadow DOM boundaries.
 */
const iconBaseStyle = css`
  .icon {
    display: inline-block;
    width: calc(var(--icon-scale, 1) * 16px);
    height: calc(var(--icon-scale, 1) * 16px);
    background-color: var(--icon-color, currentColor);
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
  }
`;

export { iconBaseStyle };
