# Validation — Phase 2: Base Layout

The implementation is complete and ready to merge when all of the following are true.

## Tests pass

- `npm test` (Vitest) exits green with no failures
- Tests assert that the `/` route response includes `<header>`, `<nav>`, `<footer>`, and `<main>`
- Tests assert nav contains anchor tags for `/agents`, `/ailments`, `/therapies`

## Structural correctness

- There is exactly one `<main>` element in the rendered HTML — owned by `Layout`, not by `App`
- `Home.tsx` contains no `<html>`, `<head>`, or `<body>` markup; it delegates entirely to `Layout`
- `App.tsx` contains no `<main>` wrapper

## Visual check

- Dev server starts without errors
- Home page renders with visible header, nav bar, main content, and footer
- Nav links are clickable (404 responses are acceptable at this stage)
- Page is still mobile-responsive; content does not break at narrow widths

## Code quality

- All styles remain inline JSX (no external CSS files added)
- No multi-line arrow functions (per tech-stack code style rules)
- `tsc --noEmit` passes with no type errors
