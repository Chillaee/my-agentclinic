# Tech Stack

AgentClinic is a server-side TypeScript application. All rendering happens on the server; the browser receives plain HTML that works well and looks good.

## Core

| Layer            | Choice                 | Rationale                                                                             |
| ---------------- | ---------------------- | ------------------------------------------------------------------------------------- |
| Language         | TypeScript             | Type safety end-to-end; satisfies Mary's requirement                                  |
| Runtime          | Node.js                | Stable, well-supported, vast ecosystem                                                |
| Server framework | **Hono**               | Lightweight, TypeScript-first, fast, excellent DX; routes and middleware feel natural |
| Templating       | Hono JSX (server-side) | JSX without React overhead; components are just functions                             |
| CSS              | Inline JSX styles      | No build step or external files; styles colocated with the component                  |

## Recommended: Hono

[Hono](https://hono.dev) is chosen over Express/Fastify because:

- First-class TypeScript with zero config
- Built-in JSX renderer for server-side HTML
- Middleware model is simple and composable
- Runs on Node, Deno, Bun, and edge runtimes without changes

## Data

- **SQLite** (via `better-sqlite3`) for local development and early production — simple, embedded, no infrastructure
- Migrations via plain SQL files; no ORM to start

## Testing

- **Vitest** — fast, TypeScript-native, compatible with the rest of the stack
- Tests written from the start; each phase adds tests alongside new logic

## Tooling

- `tsx` for development (run TypeScript directly, no build step needed)
- `tsc` for production builds
- `prettier` for formatting

## Git

- Branches are merged into main with `--no-ff` to preserve a clear record of each feature branch

## Code Style

- Arrow functions (`() => ...`) are only acceptable as one-liners with no curly braces or explicit `return` statement (e.g. `(c) => c.html(<Home />)`).
- Any function body that requires curly braces must use `function () { ... }` (anonymous) or `function name() { ... }` (named).

## What We Are Not Using

- No React, Vue, or Svelte — server-side rendering keeps the stack simple
- No ORM — SQL is sufficient at this scale
- No Docker — not yet; that's a later phase concern
