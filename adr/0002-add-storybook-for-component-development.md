# ADR-0002: Add Storybook for component development

**Status:** Accepted
**Date:** 2026-08-10

## Context

`RemittanceForm`, `RouteCard`, and `RouteList` can only be reviewed by
running the whole app (`npm run dev`) and clicking through a currency
search. That works for smoke-testing the happy path, but it makes it slow to
iterate on one component's markup or styling, and reviewers can't easily
inspect states that are awkward to reach from the UI (e.g. the "no route
found" empty state).

## Decision

Adopt Storybook 10 (React + Vite) as the component development environment.
Each component gets a `.stories.jsx` file next to it:

- Stories render against the app's real stylesheet and mock anchor data.
- Autodocs generate a props reference from the stories.
- The a11y addon runs axe checks per story.
- `npm run storybook` serves the dev UI; `npm run build-storybook` emits a
  static build to `storybook-static/` (gitignored).

## Consequences

- Component visual development and review no longer require running the
  app.
- Data shapes stay consistent with production because stories build route
  fixtures via `findRoutes()` over `mockAnchors` rather than hand-written
  duplications.
- New components should ship a matching `.stories.jsx`.
- Storybook brings its own Vite builder; config lives in `.storybook/` and
  stories follow the `*.stories.jsx` naming convention.

## Alternatives considered

- **Live app only:** free, but doesn't isolate components or expose
  edge-case states easily.
- **Isolated fixture pages inside the app:** no arg/state tooling, no a11y
  or doc generation, and pollutes the app codebase.
