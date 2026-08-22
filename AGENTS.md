## Development Philosophy

Keep it simple.

Minimize dependencies.

Build incrementally.

Follow established patterns for code formatting, naming, organization, and other conventions.

Prefer short, elegant solutions over unnecessary abstraction or complexity.

## Stack

### Frontend

JavaScript (with JSDoc for types), Lit, Web Components, HTML, CSS.

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

### Backend

Node.js, JavaScript (with JSDoc for types).

PostgreSQL, TimescaleDB.

## Resources

### UI

Establish a coherent design system of reusable UI elements for the user-facing application.

### JavaScript

Establish a robust library of reusable utility functions and classes that can be shared across the project.
