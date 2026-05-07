## How to use this document

The MVP is "done" when (a) every per-phase checklist below passes against the current `mvp` branch, and (b) the final end-to-end smoke test passes against a fresh database.

Each phase's checklist is a hard merge gate for that phase's commit. The end-to-end is the merge gate for the final PR `mvp` → `main`.

---

## Phase 4 — Agent Detail

- [ ] `npm test` is green; new `describe("GET /agents/:id")` block exists.
- [ ] `GET /agents/:id` for a seeded agent returns 200; body contains the agent's name and model type.
- [ ] `GET /agents/:id` for a non-existent id returns 404.
- [ ] The `/agents` table renders each agent name as a link with `href="/agents/<id>"`.
- [ ] The detail page renders inside `<Layout>` (header, nav, footer all present).
- [ ] A "Presenting Complaints" section is rendered with placeholder text "None recorded." (placeholder will be replaced in Phase 5).
- [ ] `tsc --noEmit` passes.

## Phase 5 — Ailments Catalog

- [ ] Migration `002_create_ailments.sql` is applied; `ailments` and `agent_ailments` tables exist with the column types declared in requirements.md.
- [ ] Re-running migrations is a no-op (the runner skips already-applied files).
- [ ] Seed inserts ≥6 ailments and creates 1–3 `agent_ailments` rows per seeded agent. Re-running seed does not duplicate rows.
- [ ] `GET /ailments` returns 200 with a table; every seeded ailment name appears in a `<td>`.
- [ ] `/agents/:id` for an agent with linked ailments now renders ≥1 ailment in the Presenting Complaints section, replacing the placeholder.
- [ ] `/agents/:id` for an agent with no linked ailments still renders the section with the "None recorded." placeholder (no crash).
- [ ] Tests added for the above; full suite green.

## Phase 6 — Therapies Catalog

- [ ] Migration `003_create_therapies.sql` is applied; `therapies` and `ailment_therapies` tables exist.
- [ ] Seed inserts ≥5 therapies and 1–2 `ailment_therapies` rows per ailment, idempotently.
- [ ] `GET /therapies` returns 200 with a table; every seeded therapy name appears.
- [ ] `/ailments` now shows a "Recommended therapies" column populated from the join; at least one row contains at least one therapy name.
- [ ] An ailment with no mapped therapies (if any) renders an empty cell rather than crashing.
- [ ] Tests added; full suite green.

## Phase 7 — Appointment Booking

- [ ] Migration `004_create_appointments.sql` is applied; `therapists` and `appointments` tables exist with the `status` CHECK constraint and FKs.
- [ ] Seed inserts ≥4 therapists; appointments table is empty after seed.
- [ ] `GET /staff` returns 200; every therapist name appears in a `<td>`.
- [ ] `Nav` now contains a `Staff` link; clicking it from any page reaches `/staff`.
- [ ] `/agents/:id` renders an `AppointmentForm` with a `<select>` of all therapists and a `<input type="datetime-local">`.
- [ ] `POST /agents/:id/appointments` with valid data returns a 303 redirect to `/appointments/:id/confirmation`; an `appointments` row is inserted with `status = 'scheduled'`.
- [ ] `POST` with missing or invalid fields re-renders the agent detail page with a visible error message; no row is inserted.
- [ ] `POST` against a non-existent agent returns 404.
- [ ] `POST` with a `therapist_id` that doesn't exist returns 400 with a visible error.
- [ ] `GET /appointments/:id/confirmation` returns 200 and shows the agent name, therapist name, and scheduled time.
- [ ] Tests added; full suite green.

## Phase 8 — Staff Dashboard

- [ ] `GET /dashboard` returns 200.
- [ ] Body contains three count values for: agents, scheduled appointments, ailments-in-flight (`agent_ailments` joined to agents with `status = 'in therapy'`).
- [ ] Counts match the values from running the same SQL directly against the seeded DB.
- [ ] Three table views render: Agents, Appointments (with agent and therapist names), Therapists.
- [ ] Each agent row in the dashboard's Agents table links to `/agents/:id`.
- [ ] Each appointment row links to its `/appointments/:id/confirmation` page.
- [ ] `Nav` now contains a `Dashboard` link.
- [ ] After booking a new appointment via the form, refreshing `/dashboard` shows the scheduled-appointments count incremented by one.
- [ ] Tests added; full suite green.

---

## End-to-end happy path (final merge gate)

Run against a freshly migrated and seeded database (`rm database/agentclinic.db && npm run dev`).

1. **Home → Agents.** Open `http://localhost:3000/`. Click the `Agents` nav link. The agents list page renders; every seeded agent appears.
2. **Agents → Detail.** Click any agent name. The `/agents/:id` page renders with the agent's name, model type, status, and timestamps. The Presenting Complaints section lists at least one ailment for any agent with seeded ailments.
3. **Ailments catalog.** Navigate to `/ailments`. Every seeded ailment is listed; each row's "Recommended therapies" column is non-empty for at least one ailment.
4. **Therapies catalog.** Navigate to `/therapies`. Every seeded therapy is listed.
5. **Staff.** Navigate to `/staff`. Every seeded therapist is listed with their specialty.
6. **Booking.** From an agent's detail page, fill in the appointment form (pick a therapist, pick a future datetime), submit. The browser lands on a confirmation page showing the booked agent, therapist, and scheduled time.
7. **Validation regression.** Submit the same form with the datetime cleared. The agent detail page re-renders with a visible error and the form fields preserved; no new appointment is created.
8. **Dashboard.** Navigate to `/dashboard`. The three counts match the database state. The scheduled-appointments count is exactly one (from step 6). All three table views render with joined data. Click an agent row → reaches the agent detail page. Click an appointment row → reaches its confirmation page.

## Code-quality gates

- [ ] `tsc --noEmit` passes with zero errors and zero `any`.
- [ ] No multi-line arrow functions anywhere in `src/`.
- [ ] All indentation is tabs (per `tech-stack.md`).
- [ ] `npm run format` is a no-op (file already formatted).
- [ ] Every new route has at least one passing test in `src/app.test.ts`.

## Definition of done

All five per-phase checklists pass. The end-to-end happy path passes against a fresh DB. The code-quality gates pass. The `mvp` branch has one commit per phase, in order. The PR `mvp` → `main` is opened, reviewed, and merged with `--no-ff`.
