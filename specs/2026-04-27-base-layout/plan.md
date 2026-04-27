# Plan — Phase 2: Base Layout

## 1. Create chrome components

- `src/components/Header.tsx` — renders `<header>` with AgentClinic branding link
- `src/components/Nav.tsx` — renders `<nav>` with links to `/`, `/agents`, `/ailments`, `/therapies`
- `src/components/Footer.tsx` — renders `<footer>` with tagline "AI agents have feelings too."

## 2. Create `Layout` component

- Create `src/components/Layout.tsx`
- Accept a `children` prop (`PropsWithChildren` from `hono/jsx`)
- Render the full document shell: `<html>`, `<head>` (charset, viewport, title), `<body>`
- Compose `<Header />`, `<Nav />`, `<main>{children}</main>`, `<Footer />` inside `<body>`

## 3. Update existing components

- `Home.tsx` — replace full document markup with `<Layout><App /></Layout>`; remove all html/head/body/style markup from this file
- `App.tsx` — remove the `<main>` wrapper; render content directly (Layout now owns `<main>`)

## 4. Write tests

- Add tests in `src/app.test.ts` (or a new `src/components/Layout.test.tsx`) covering:
    - Response for `/` contains `<header>`
    - Response for `/` contains `<nav>`
    - Response for `/` contains `<footer>`
    - Nav contains links to `/agents`, `/ailments`, `/therapies`
    - Page content still renders inside `<main>`

## 5. Smoke test

- Run the dev server (`npm run dev` or `tsx src/index.tsx`)
- Visit `http://localhost:3000` and confirm header, nav, content, and footer all appear
- Confirm nav links exist (404 is expected for unbuilt routes)
- Confirm no visual regressions on the home page content
