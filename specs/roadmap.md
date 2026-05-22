# Roadmap

Derived from `TODO.md`. Phases 1–8 are already shipped (see `git log` — agents, ailments, therapies, therapists, appointment booking, staff dashboard). This roadmap picks up from phase 9.

Each phase is intentionally small: one user-visible improvement, its tests, and `npm run format`.

## Now

### Phase 9 — Better booking interface

- Audit the current booking flow end-to-end as an agent-patient.
- List the top 3 friction points (one commit per finding is fine).
- Improve form layout, validation messaging, and date/time selection.
- Add Vitest coverage for the new validation paths.

### Phase 10 — Appointments page

- Logged-in agent (or staff acting on behalf) sees a list of their upcoming and past appointments.
- Sort by date; group "upcoming" vs. "past."
- Link each row back to the therapist and therapy detail pages.
- Tests: empty state, upcoming-only, past-only, mixed.

### Phase 11 — Feedback form

- Free-text feedback tied to a completed appointment.
- New `feedback` table + migration `005_create_feedback.sql`.
- Staff dashboard surface: list recent feedback entries.
- Tests: submission persists, validation rejects empty body, dashboard renders.

## Future

### Phase 12 — Customer reviews

- Public-facing reviews attached to therapists or therapies (decide which during design).
- Moderation flag on the staff dashboard before a review is published.
- Tests: unpublished reviews hidden from public, staff can publish/unpublish.

### Phase 13 — About us page

- Static page with clinic address, hours, and an embedded map.
- Decide map provider during design (OpenStreetMap embed is the boring default).
- No tests required beyond a render smoke test.
