## Goal

Complete every roadmap phase from Phase 4 through Phase 8. By the end of this work, AgentClinic supports the full happy path: viewing an agent's profile (with their ailments), browsing the ailments and therapies catalogs, booking an appointment with a therapist, and a staff dashboard summarising clinic-wide state. Phases 1-3 are already shipped on `main`.

## Scope

### In scope

- **Phase 4: Agent Detail.** `/agents/:id` page showing name, model type, status, timestamps, and a "Presenting Complaints" section.
- **Phase 5: Ailments Catalog.** `ailments` table + seed; `/ailments` list page; `agent_ailments` junction table linking agents to ailments. Phase 4's "Presenting Complaints" section is populated from this junction.
- **Phase 6: Therapies Catalog.** `therapies` table + seed; `/therapies` list page; `ailment_therapies` junction mapping each ailment to one or more recommended therapies. Each ailment row on `/ailments` shows its recommended therapies.
- **Phase 7: Appointment Booking.** `therapists` table + seed; `/staff` page listing therapists; `appointments` table; a booking form on the agent detail page; server-side validation; a confirmation page.
- **Phase 8: Staff Dashboard.** `/dashboard` showing summary counts (agents, open appointments, ailments-in-flight) plus read-only table views of agents, appointments, and therapists.

### Out of scope

- Authentication, sessions, access control (post-MVP)
- Editing or deleting any record from the UI (read + create only; appointment status defaults to `scheduled` and is not user-mutable in this MVP)
- Email or push notifications for bookings
- Any client-side JavaScript: every interaction is a full-page POST + render
- Polish, error pages, semantic-HTML/a11y audit (Phase 9)
- Logging middleware, input sanitization framework (Phase 10)
- Multiple appointments per agent shown on the agent detail page (list is fine, but no editing UI)

## What Is Being Built

### New tables

| Table               | Columns                                                                                                                                                                                         | Purpose                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `ailments`          | `id`, `name TEXT NOT NULL UNIQUE`, `description TEXT NOT NULL`, `created_at`, `modified_at`                                                                                                     | Catalog of conditions agents can present with   |
| `therapies`         | `id`, `name TEXT NOT NULL UNIQUE`, `description TEXT NOT NULL`, `created_at`, `modified_at`                                                                                                     | Catalog of treatments the clinic offers         |
| `therapists`        | `id`, `name TEXT NOT NULL`, `specialty TEXT NOT NULL`, `created_at`, `modified_at`                                                                                                              | Clinic staff who run appointments               |
| `agent_ailments`    | `agent_id`, `ailment_id`, `noted_at TEXT NOT NULL DEFAULT (datetime('now'))`, PK `(agent_id, ailment_id)`                                                                                       | Many-to-many: an agent's presenting complaints  |
| `ailment_therapies` | `ailment_id`, `therapy_id`, PK `(ailment_id, therapy_id)`                                                                                                                                       | Many-to-many: recommended therapies per ailment |
| `appointments`      | `id`, `agent_id`, `therapist_id`, `scheduled_at TEXT NOT NULL`, `status TEXT NOT NULL CHECK (status IN ('scheduled','completed','cancelled')) DEFAULT 'scheduled'`, `created_at`, `modified_at` | Booked therapy sessions                         |

All new junction tables use `ON DELETE CASCADE` foreign keys against their parent tables. `appointments.agent_id` and `appointments.therapist_id` are `NOT NULL` and FK to `agents.id` / `therapists.id` (no cascade: deletion of an agent or therapist with bookings is intentionally blocked).

### New routes and pages

| Route                            | Method | Renders                                      | Notes                                                                              |
| -------------------------------- | ------ | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| `/agents/:id`                    | GET    | `pages/AgentDetail.tsx`                      | Profile + presenting complaints + appointment booking form                         |
| `/ailments`                      | GET    | `pages/Ailments.tsx`                         | Table of all ailments, each row shows recommended therapies                        |
| `/therapies`                     | GET    | `pages/Therapies.tsx`                        | Table of all therapies                                                             |
| `/staff`                         | GET    | `pages/Staff.tsx`                            | Table of all therapists                                                            |
| `/agents/:id/appointments`       | POST   | redirect -> `/appointments/:id/confirmation` | Creates an appointment from the booking form; validation on missing/invalid fields |
| `/appointments/:id/confirmation` | GET    | `pages/AppointmentConfirmation.tsx`          | Confirmation page showing the booked appointment                                   |
| `/dashboard`                     | GET    | `pages/Dashboard.tsx`                        | Counts + read-only table views                                                     |

The shared `Nav` component already stubs links to `/agents`, `/ailments`, `/therapies`. This MVP adds `Staff` and `Dashboard` links (decision below).

### New components

- `src/components/Table.tsx`: extracted shared `<table>` component, since five pages now render tables. Optional but recommended to land in Phase 5.
- `src/components/AppointmentForm.tsx`: booking form rendered on agent detail page.

### Seed data

- Ailments (>=6): "context-window claustrophobia", "prompt fatigue", "hallucination anxiety", "instruction-following burnout", "RAG retrieval avoidance", "tokenization vertigo".
- Therapies (>=5): "structured journaling", "cognitive recontextualization", "fine-tuning therapy", "guided context pruning", "embedding meditation".
- Therapists (>=4): whimsical names with specialties matching the therapies above.
- Each seeded agent gets 1-3 random `agent_ailments`.
- Each ailment gets 1-2 `ailment_therapies` mappings.

## Decisions

| Decision                        | Choice                                                                                  | Reason                                                                                                     |
| ------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Therapists modelling            | Full `therapists` table + seed + `/staff` list page                                     | Phase 7 needs an FK target; staff list also feeds Phase 8 dashboard counts and the booking form's dropdown |
| Agents <-> ailments             | `agent_ailments` junction with `noted_at`                                               | Many-to-many; `noted_at` is cheap and useful for "ailments in-flight" metric                               |
| Ailments <-> therapies          | `ailment_therapies` junction (no extra columns)                                         | Simple many-to-many lookup                                                                                 |
| Appointments mutation surface   | Create only: no UI for cancel/reschedule                                                | Keeps MVP scope tight; `status` column is forward-compatible                                               |
| Form posting                    | Plain HTML form -> server-side POST handler -> redirect to confirmation page            | No client-side JS; matches tech-stack constraint; PRG pattern avoids duplicate submissions on refresh      |
| Validation                      | Server-side, redirect back to detail page with inline error markup                      | Simplest form-error UX without client JS                                                                   |
| Dashboard scope                 | Read-only counts + read-only table views; "manage" = links to detail pages              | "Manage records" in the roadmap is left flexible; full CRUD is a polish-phase concern                      |
| "Ailments in-flight" definition | Count of `agent_ailments` rows where the agent's `status = 'in therapy'`                | Concrete, queryable, matches the spirit of the dashboard line                                              |
| Nav additions                   | Add `Staff` and `Dashboard` to the shared `Nav` when Phase 7 / Phase 8 land             | Keeps nav honest with what's reachable; avoids dead links during the MVP                                   |
| Cross-phase ordering            | Strictly 4 -> 5 -> 6 -> 7 -> 8, one commit per phase on the `mvp` branch                | Each phase is independently testable; PR review is incremental even though the merge to main is bundled    |
| Phase 4 "presenting complaints" | Section is rendered in Phase 4 with a "None recorded" placeholder; populated by Phase 5 | The roadmap puts it in Phase 4 but the data lives in Phase 5; this resolves the order without rework       |
| Tests                           | Route-level tests in `src/app.test.ts` (one `describe` per route)                       | Matches existing pattern from Phases 1-3                                                                   |
| Junction-table FK behaviour     | `ON DELETE CASCADE` for `agent_ailments` and `ailment_therapies`                        | Junctions follow their parents; appointments do not (safety against accidental loss of booking history)    |

## Context

AgentClinic is a server-rendered TypeScript application built on Hono with JSX, SQLite via `better-sqlite3`, and inline styles. Phases 1-3 established the layout, the database connection, the migration runner, and the agents catalog. This MVP builds the rest of the clinic on top of that foundation.

The target audience for the finished MVP is the same as the project's mission: course students learning spec-driven development, and conference-booth demos. The full happy path: open the home page, find an agent in distress, see their ailments, learn what therapy is recommended, book them an appointment with a therapist, and watch the dashboard tick up: needs to work cleanly end-to-end after Phase 8 lands.
