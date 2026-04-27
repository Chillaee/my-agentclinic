# Plan — Phase 2: Base Layout

## 1. Create `Layout` component

- Create `src/components/Layout.tsx`
- Accept a `children` prop (Hono JSX `FC` with `{ children: Child }`)
- Render the full document shell: `<html>`, `<head>` (charset, viewport, title), `<body>`
- `<header>` — site name "AgentClinic" with inline styles
- `<nav>` — links to `/`, `/agents`, `/ailments`, `/therapies` with inline styles
- `<main>{children}</main>` — page content slot with inline styles
- `<footer>` — tagline "AI agents have feelings too." with inline styles

## 2. Update existing components

- `Home.tsx` — replace full document markup with `<Layout><App /></Layout>`; remove all html/head/body/style markup from this file
- `App.tsx` — remove the `<main>` wrapper; render content directly (Layout now owns `<main>`)

## 3. Write tests

- Add tests in `src/app.test.ts` (or a new `src/components/Layout.test.tsx`) covering:
  - Response for `/` contains `<header>`
  - Response for `/` contains `<nav>`
  - Response for `/` contains `<footer>`
  - Nav contains links to `/agents`, `/ailments`, `/therapies`
  - Page content still renders inside `<main>`

## 4. Smoke test

- Run the dev server (`npm run dev` or `tsx src/index.tsx`)
- Visit `http://localhost:3000` and confirm header, nav, content, and footer all appear
- Confirm nav links exist (404 is expected for unbuilt routes)
- Confirm no visual regressions on the home page content
