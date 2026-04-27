# Validation — Phase 3: Agent List

The implementation is complete and ready to merge when all of the following are true.

## Tests pass

- `npm test` exits green with no failures
- `GET /agents` test: responds 200
- `GET /agents` test: response body contains `<table`
- `GET /agents` test: response body contains at least one seeded agent name

## Database correctness

- `database/agentclinic.db` is created on first run; the `database/` directory is gitignored
- `migrations` tracking table exists and contains one row for `001_create_agents.sql`
- `agents` table has columns: `id`, `name`, `model_type`, `status`, `created_at`, `modified_at`
- Running `src/index.tsx` twice does not duplicate seed rows

## Route and page

- `GET /agents` returns 200 with an HTML table
- Table has header columns for Name, Model Type, and Status
- All seeded agents appear as rows
- Page renders inside the shared `Layout` (header, nav, footer visible)
- Nav "Agents" link resolves to this page without 404

## Code quality

- No multi-line arrow functions (per tech-stack code style)
- `tsc --noEmit` passes with no type errors
- `agentclinic.db` is listed in `.gitignore`
