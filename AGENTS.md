## Development Philosophy

Keep it simple.

Minimize dependencies.

Build incrementally.

Follow established patterns for code formatting, naming, organization, and other conventions.

Prefer short, elegant solutions over unnecessary abstraction or complexity.

When designing types, make invalid states impossible to represent, rather
than allowing them and guarding against them at runtime.

## Stack

### Frontend

JavaScript (with JSDoc for types), Lit, Web Components, HTML, CSS.

#### Importing JSDoc types

Import types at the top of the file with `@import`, never inline
`import("./x.js").Foo` at the point of use:

#### Exports

Never export at the point of definition (`export class Foo`, `export const
x = ...`). Define everything unexported and collect all of a file's exports
in one `export { ... };` block at the very end, so every export a file
provides can be found in one place. A barrel file re-exporting from other
modules (`export * from "./x.js"`, `export { x } from "./x.js"`) already is
that block, so it doesn't need further wrapping.

#### Component pattern

- `*.wc.js` — a web component (`LitElement`). Purely presentational: its only
  state is `set ic(ic)`, storing a plain "interface" object and calling
  `requestUpdate()`. `render()` reads only from that `ic`. No app logic, no
  fetching, no internal state beyond what it's given.
- `*.jc.js` — an optional plain JavaScript class that drives a `wc` when it
  needs real state or behavior. It owns the state, does the actual work, and
  on each change builds a fresh `IXxx` interface object (data + callbacks) and
  assigns it to the `wc`'s `.ic` property. Renders are debounced with a short
  `setTimeout` so multiple state changes in one tick coalesce into one
  repaint.
- Stateless components (e.g. a plain button) only need a `.wc.js` — don't add
  a `.jc.js` unless there's real state to manage.

#### `ic` field convention

An `IXxx` interface object has three kinds of fields, distinguished by naming:

- Plain fields (`title`, `icon`) — cheap, always-relevant data. Read directly.
- `get*` (`getHeavyData`) — an explicit escape hatch for data that's expensive
  to compute and only sometimes needed. Only call it from the branch of `render()` that actually needs the value, never unconditionally — otherwise
  it's just a plain field with extra ceremony.
- `on*` (`onClick`) — an interaction callback. Its _absence_ (`undefined`) means that interaction is disabled, e.g. `onClick === undefined` should drive a `disabled` attribute rather than being treated as a no-op handler.

#### `IXxx` naming

The `I` prefix is reserved for a component's actual `.ic` interface object —
the type assigned to a `wc`'s `set ic(ic)` (e.g. `IButton`, `IDashboard`).
Nested pieces of an interface object (e.g. `ITabs`'s `options: TabOption[]`),
options passed to a plain function (e.g. `ConfirmOptions`), and unrelated
data types (e.g. a DB row shape) are not interface objects and should not be
prefixed with `I` — plain `PascalCase` instead.

#### Colors

Always use the CSS variables defined in `packages/ui/src/tokens.css` (the color scales and their semantic aliases, e.g. `var(--color-primary)`, `var(--color-text)`). Don't define one-off colors inline (hex/rgb literals) - if a needed shade is missing from the scales, add it to `tokens.css` rather than hardcoding it at the point of use.

#### Layout

Use simple CSS utility classes from the UI package for layout. Do not create Web Components for layout primitives.

Layout utility classes are prefixed `ui-` (`.ui-row`, `.ui-gap-md`, etc.),
matching the same prefix used for `packages/ui`'s custom element tag names,
so they can't collide with unrelated global class names in an app that
renders them in light DOM.

Layout utility classes are plain CSS classes, not custom properties - they
don't cross a Shadow DOM boundary the same way color tokens do. A
page/layout-composing `*.wc.js` (one that arranges other components using
these classes) should render in light DOM (`createRenderRoot() { return
this; }`) so the classes apply directly. Leaf/atomic design-system
components (button, checkbox, etc.) keep the default Shadow DOM for their
own style encapsulation - only components whose job is composing a layout
need light DOM.

### Backend

Node.js, JavaScript (with JSDoc for types).

PostgreSQL, TimescaleDB.

## Resources

### UI

Establish a coherent design system of reusable UI elements for the user-facing application.

### JavaScript

Establish a robust library of reusable utility functions and classes that can be shared across the project.
