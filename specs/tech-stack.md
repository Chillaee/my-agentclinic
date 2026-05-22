# Tech Stack

## Principles

- **TypeScript everywhere.** Per Mary's request — one language across server, views, and tests.
- **Popular, boring choices.** Reliability over novelty. Prefer stacks with large communities and stable releases.
- **Server-rendered first.** JSX on the server via Hono; ship HTML, sprinkle interactivity where it earns its keep. No SPA framework unless a feature genuinely requires it.
- **One database file.** SQLite via `better-sqlite3`. Synchronous, embedded, easy to back up.
- **Tabs for indentation.** Every file type. Enforced via Prettier config.

## Current stack

| Layer          | Choice                 | Notes                                                                |
| -------------- | ---------------------- | -------------------------------------------------------------------- |
| Runtime        | Node.js (ESM)          | `"type": "module"` in `package.json`                                 |
| Web framework  | Hono `^4.12`           | Routing + JSX renderer                                               |
| Server adapter | `@hono/node-server`    | Production server                                                    |
| Dev runner     | `tsx watch`            | Hot reload for `src/index.tsx`                                       |
| Views          | Hono JSX (`.tsx`)      | Server-rendered components in `src/components`, pages in `src/pages` |
| Database       | `better-sqlite3` `^12` | File at `database/agentclinic.db`                                    |
| Schema         | Raw SQL migrations     | Files in `migrations/` numbered `NNN_*.sql`                          |
| Tests          | Vitest `^4`            | `app.test.ts` colocated with `app.tsx`                               |
| Formatting     | Prettier `^3`          | Run via `npm run format` after every change                          |

## Known gaps (open decisions)

These are gaps observed in the current repo. They are not yet decided — list them so the next phase can pick.

1. **Frontend styling.** Handwritten CSS so far because that doesn't require a build step or decoupling anything.
2. **Auth / sessions.** Staff dashboard exists with no authentication layer. Needs a decision before the dashboard is exposed to anyone outside the team.
3. **Migration runner.** SQL files in `migrations/` have no documented runner. Needs either a tiny in-repo script or a library (e.g. `node-pg-migrate`-style, adapted for SQLite). Alternatively an ORM, but that can come later.
4. **Lint + CI.** Prettier handles formatting, but there is no ESLint, type-check, or CI workflow. Reliability goal implies adding at least `tsc --noEmit` and `vitest run` on PRs.

## Constraints

- Modern evergreen browsers only (Chrome, Firefox — current and previous major).
- No build step for client JS until a feature demands it.
- Keep `package.json` lean — every dependency added should pay rent.
