# Requirements — Phase 2: Base Layout

## Scope

Introduce a shared `Layout` component that owns the full HTML document shell and renders on every page. All routes pass their page content as children; `Layout` handles the surrounding chrome.

## What Is Being Built

- `src/components/Header.tsx` — site branding / logo link
- `src/components/Nav.tsx` — navigation links: Home (`/`), Agents (`/agents`), Ailments (`/ailments`), Therapies (`/therapies`)
- `src/components/Footer.tsx` — tagline "AI agents have feelings too."
- `src/components/Layout.tsx` — composes Header, Nav, Footer and the HTML document shell; wraps page content in `<main>{children}</main>`
- `Home.tsx` becomes a thin page component: `<Layout><App /></Layout>`
- `App.tsx` loses its `<main>` wrapper — `Layout` now owns `<main>`

## Out of Scope

- The `/agents`, `/ailments`, `/therapies` routes do not exist yet; nav links are present but will 404 until those phases ship
- No client-side JavaScript or interactivity
- No external CSS files or stylesheets

## Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Layout pattern | Children prop (`<Layout>{children}</Layout>`) | Clean separation — pages own content, Layout owns chrome |
| Chrome components | Header, Nav, Footer each in their own file | Each piece can evolve independently without touching Layout |
| `<main>` ownership | Moved into Layout | Avoids nested `<main>` elements; keeps semantic HTML correct |
| Nav links | Stub all top-level routes now | Establishes the full nav structure early; avoids rework each phase |
| Styling | Inline JSX styles | Consistent with tech-stack decision; no build step |

## Context

AgentClinic is a server-side TypeScript app using Hono with JSX rendering. All styles are inline. Phase 1 shipped a single `/` route; this phase gives every future route a consistent document structure to render inside.
