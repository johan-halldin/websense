import { css } from "lit";

/**
 * Shared layout utility classes (.ui-row, .ui-gap-md, etc.) as an
 * importable Lit style, so any Shadow DOM component can opt into them via
 * `static styles` the same way leaf components already share
 * `iconBaseStyle` (see icons/icon-styles.js), instead of needing to render
 * in light DOM just to reach layout.css. Lit caches this CSSResult, so
 * importing it from many components adopts one shared stylesheet rather
 * than re-parsing/duplicating it per instance.
 *
 * Mirrors layout.css, which stays a plain stylesheet for contexts that
 * link it directly (e.g. this package's own *.example.html demos) - keep
 * the two in sync by hand when either changes.
 */
const layoutStyle = css`
  .ui-row {
    display: flex;
    flex-direction: row;
  }

  .ui-stack {
    display: flex;
    flex-direction: column;
  }

  .ui-gap-2xs {
    gap: var(--space-2xs);
  }
  .ui-gap-xs {
    gap: var(--space-xs);
  }
  .ui-gap-sm {
    gap: var(--space-sm);
  }
  .ui-gap-md {
    gap: var(--space-md);
  }
  .ui-gap-lg {
    gap: var(--space-lg);
  }
  .ui-gap-xl {
    gap: var(--space-xl);
  }
  .ui-gap-2xl {
    gap: var(--space-2xl);
  }

  .ui-padding-2xs {
    padding: var(--space-2xs);
  }
  .ui-padding-xs {
    padding: var(--space-xs);
  }
  .ui-padding-sm {
    padding: var(--space-sm);
  }
  .ui-padding-md {
    padding: var(--space-md);
  }
  .ui-padding-lg {
    padding: var(--space-lg);
  }
  .ui-padding-xl {
    padding: var(--space-xl);
  }
  .ui-padding-2xl {
    padding: var(--space-2xl);
  }

  .ui-align-start {
    align-items: flex-start;
  }
  .ui-align-center {
    align-items: center;
  }
  .ui-align-end {
    align-items: flex-end;
  }

  .ui-justify-start {
    justify-content: flex-start;
  }
  .ui-justify-center {
    justify-content: center;
  }
  .ui-justify-end {
    justify-content: flex-end;
  }
  .ui-justify-between {
    justify-content: space-between;
  }

  .ui-fill-viewport {
    height: 100dvh;
    box-sizing: border-box;
  }

  .ui-flex-1 {
    flex: 1;
    min-height: 0;
  }
`;

export { layoutStyle };
