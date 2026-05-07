## Working model

- Branch: `mvp` (already created from `main` at the start of this work).
- One commit per phase. After each phase commit, run `npm test`, `npm run build`, and `npm run format`.
- Final PR merges `mvp` -> `main` with `--no-ff` once Phase 8 is green.

---

## Phase 4: Agent Detail

1. **Route**
    - Add `GET /agents/:id` to `src/app.tsx`.
    - Query the agent by id. If not found, return 404.
2. **Page**
    - Create `src/pages/AgentDetail.tsx` rendering inside `<Layout>`.
    - Show name (`<h1>`), model type, status, `created_at`, `modified_at`.
    - Render a `<section>` with heading "Presenting Complaints" and the placeholder text "None recorded." (populated in Phase 5).
3. **Linkage**
    - Update `src/pages/Agents.tsx` so each agent name in the table links to `/agents/:id`.
4. **Tests** (`src/app.test.ts`)
    - `GET /agents/:id` for a seeded agent -> 200; body contains the agent name and model type.
    - `GET /agents/:id` for a non-existent id -> 404.
    - `/agents` table contains an `<a href="/agents/...">` link for each agent.
5. **Commit**: "Phase 4: agent detail page".

---

## Phase 5: Ailments Catalog

1. **Migration** `migrations/002_create_ailments.sql`
    - `ailments` table per requirements.md.
    - `agent_ailments` junction with composite PK and `ON DELETE CASCADE` FKs.
2. **Seed** (`src/db/seed.ts`)
    - Seed ailments (>=6) using `INSERT OR IGNORE`.
    - Seed `agent_ailments`: assign 1-3 ailments per existing agent. Idempotent: guard with a `SELECT COUNT(*) FROM agent_ailments` check or use `INSERT OR IGNORE` on `(agent_id, ailment_id)`.
3. **Route + page**
    - `GET /ailments` -> `src/pages/Ailments.tsx` rendering a table with columns: Name, Description.
4. **Wire Phase 4's complaints section**
    - In the `/agents/:id` handler, also query `agent_ailments JOIN ailments` for that agent.
    - Replace the placeholder in `AgentDetail.tsx` with a `<ul>` of ailment names + descriptions; fall back to "None recorded." when empty.
5. **Tests**
    - `GET /ailments` -> 200; body contains a `<table>` and each seeded ailment name.
    - `GET /agents/:id` for an agent with seeded ailments shows at least one ailment name.
6. **Commit**: "Phase 5: ailments catalog + agent linkage".

---

## Phase 6: Therapies Catalog

1. **Migration** `migrations/003_create_therapies.sql`
    - `therapies` table.
    - `ailment_therapies` junction with composite PK and `ON DELETE CASCADE` FKs.
2. **Seed**
    - Seed therapies (>=5) using `INSERT OR IGNORE`.
    - Seed `ailment_therapies`: 1-2 therapies per ailment.
3. **Route + page**
    - `GET /therapies` -> `src/pages/Therapies.tsx` (table: Name, Description).
4. **Augment ailments page**
    - In `/ailments`, join `ailment_therapies` + `therapies` per ailment row and render a comma-separated "Recommended therapies" column.
5. **Tests**
    - `GET /therapies` -> 200; body contains each seeded therapy name.
    - `/ailments` body contains at least one therapy name in the recommended-therapies column.
6. **Commit**: "Phase 6: therapies catalog + ailment mapping".

---

## Phase 7: Appointment Booking

1. **Migration** `migrations/004_create_appointments.sql`
    - `therapists` table.
    - `appointments` table per requirements.md (with `status` CHECK constraint and FKs).
2. **Seed**
    - Seed therapists (>=4).
    - Do NOT seed appointments: those are created via the form.
3. **Pages and components**
    - `src/pages/Staff.tsx`: table of therapists (Name, Specialty).
    - `src/components/AppointmentForm.tsx`: `<form method="post" action="/agents/:id/appointments">` with a `<select>` of therapists, a `<input type="datetime-local" name="scheduled_at">`, and a submit button.
    - `src/pages/AppointmentConfirmation.tsx`: confirms a booked appointment.
4. **Routes**
    - `GET /staff` -> `Staff.tsx`.
    - Mount `AppointmentForm` on `/agents/:id` (Phase 4 page).
    - `POST /agents/:id/appointments`: validate (agent exists, therapist_id is a real therapist, scheduled_at parses, future-dated), insert into `appointments`, redirect (303) to `/appointments/:id/confirmation`.
    - `GET /appointments/:id/confirmation` -> `AppointmentConfirmation.tsx` showing agent name, therapist name, scheduled time, status.
5. **Validation handling**
    - On invalid input, re-render the agent detail page with inline error markup above the form. Keep submitted values in the form fields.
6. **Nav update**
    - Add a `Staff` link to `src/components/Nav.tsx`.
7. **Tests**
    - `GET /staff` -> 200, contains each seeded therapist name.
    - `POST /agents/:id/appointments` with valid data -> 303 redirect to confirmation; appointment row exists in DB.
    - `POST /agents/:id/appointments` with missing fields -> 400 (or 200 with re-rendered form) and inline error visible.
    - `POST` against a non-existent agent -> 404.
    - `GET /appointments/:id/confirmation` for a real appointment -> 200 with agent + therapist + scheduled time.
8. **Commit**: "Phase 7: appointment booking".

---

## Phase 8: Staff Dashboard

1. **Route + page**
    - `GET /dashboard` -> `src/pages/Dashboard.tsx`.
    - Queries:
        - `SELECT COUNT(*) FROM agents`
        - `SELECT COUNT(*) FROM appointments WHERE status = 'scheduled'`
        - "Ailments in-flight": `SELECT COUNT(*) FROM agent_ailments aa JOIN agents a ON a.id = aa.agent_id WHERE a.status = 'in therapy'`
2. **Layout**
    - Top section: three large stat cards (`<section>` with heading + count) for the three metrics above.
    - Below: three table views: Agents, Appointments (with agent name + therapist name joined), Therapists. Each row in the agents table links to `/agents/:id`; each appointment links to its confirmation page.
3. **Nav update**
    - Add a `Dashboard` link to `Nav.tsx`.
4. **Tests**
    - `GET /dashboard` -> 200, contains all three count values (assert numerically against a fresh DB).
    - Body contains each seeded agent name and each seeded therapist name (sanity that joins worked).
5. **Commit**: "Phase 8: staff dashboard".

---

## Final integration

1. Run the full happy-path manually per `validation.md`'s end-to-end section.
2. `npm test`, `npm run build`, `npm run format`.
3. Open PR `mvp` -> `main`. Merge with `--no-ff` after green.

## Order of operations

Phases must land in numerical order: each phase's tests depend on the prior phase's data and routes. Don't try to parallelise.
