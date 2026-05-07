# Requirements — Phase 3: Agent List

## Scope

Introduce the SQLite database, the first migration, seed data, and an `/agents` route that renders a table of all registered agents.

## What Is Being Built

### Database layer

- `src/db/database.ts` — opens and exports a single `better-sqlite3` connection; database file lives at `database/agentclinic.db` (directory created automatically; gitignored)
- `migrations/001_create_agents.sql` — creates the `agents` table
- `src/db/migrate.ts` — reads and applies SQL migration files in order; safe to re-run (skips already-applied migrations via a `migrations` tracking table)
- `src/db/seed.ts` — inserts whimsical fictional agents if the table is empty

### agents table schema

| Column        | Type                                      | Notes                                         |
| ------------- | ----------------------------------------- | --------------------------------------------- |
| `id`          | `INTEGER PRIMARY KEY AUTOINCREMENT`       |                                               |
| `name`        | `TEXT NOT NULL`                           | e.g. "Cogsworth-7"                            |
| `model_type`  | `TEXT NOT NULL`                           | e.g. "Claude 3 Sonnet"                        |
| `status`      | `TEXT NOT NULL`                           | e.g. "in therapy", "waitlisted", "discharged" |
| `created_at`  | `TEXT NOT NULL DEFAULT (datetime('now'))` | ISO 8601 string                               |
| `modified_at` | `TEXT NOT NULL DEFAULT (datetime('now'))` | ISO 8601 string; updated manually on writes   |

### Route and page

- `GET /agents` — queries all agents ordered by `name`, renders `src/pages/Agents.tsx`
- `Agents.tsx` — renders inside `<Layout>`; displays a plain HTML table with columns: Name, Model Type, Status

### Startup wiring

- `src/index.tsx` calls migrate then seed before starting the server

## Out of Scope

- Clicking an agent name to view a detail page (Phase 4)
- Ailments or therapies linked to agents (Phase 5/6)
- Any write operations (create, update, delete agents)
- Auth or access control

## Decisions

| Decision      | Choice                           | Reason                                                              |
| ------------- | -------------------------------- | ------------------------------------------------------------------- |
| Database      | `better-sqlite3`                 | Synchronous API; fits Hono's request-response model cleanly         |
| Migrations    | Plain SQL files + tracking table | Matches tech-stack spec; no ORM; predictable and inspectable        |
| Seed strategy | Insert if table empty            | Idempotent; no risk of duplicates on restart                        |
| Seed tone     | Whimsical fictional agents       | Matches the AgentClinic voice; engaging for demos                   |
| List layout   | Simple HTML table                | Readable at a glance; consistent with staff-dashboard direction     |
| `modified_at` | Set explicitly on writes         | SQLite has no automatic update trigger; application layer owns this |

## Context

AgentClinic serves agents, therapists, and staff. The `/agents` page is the first data-backed route and sets the pattern for all future database work: plain SQL migrations, a single shared connection, and server-rendered HTML.
