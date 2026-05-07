# Plan — Phase 3: Agent List

## 1. Install dependencies

- `npm install better-sqlite3`
- `npm install --save-dev @types/better-sqlite3`

## 2. Database connection

- Create `src/db/database.ts`
- Open a `better-sqlite3` connection to `agentclinic.db` at the project root
- Export the single `db` instance for use across the app

## 3. Migration runner

- Create `migrations/` directory
- Create `migrations/001_create_agents.sql` with the `agents` table DDL
- Create `src/db/migrate.ts`
    - Creates a `migrations` tracking table if it doesn't exist
    - Reads `.sql` files from `migrations/` in filename order
    - Applies each file not yet recorded in the tracking table
    - Records applied migrations by filename

## 4. Seed data

- Create `src/db/seed.ts`
- Insert 6–8 whimsical fictional agents if `SELECT COUNT(*) FROM agents` is 0
- Each agent has a name, model_type, status, and timestamps

## 5. Wire up startup

- Update `src/index.tsx` to call `migrate()` then `seed()` before `serve()`

## 6. `/agents` route and page

- Create `src/pages/Agents.tsx`
    - Accepts an array of agent rows as a prop
    - Renders inside `<Layout>`
    - Page heading: "Agents"
    - HTML `<table>` with columns: Name, Model Type, Status
    - One `<tr>` per agent
- Add `GET /agents` to `src/app.tsx`
    - Query all agents ordered by `name ASC`
    - Pass results to `<Agents agents={rows} />`

## 7. Tests

- Add a `describe("GET /agents")` block to `src/app.test.ts`
    - Responds with 200
    - Response body contains `<table`
    - Response body contains at least one seeded agent name

## 8. Smoke test

- Start the dev server
- Visit `http://localhost:3000/agents`
- Confirm the table renders with all seeded agents
- Confirm the nav "Agents" link now resolves correctly
