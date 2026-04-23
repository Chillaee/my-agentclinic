# Requirements — Phase 1: Hello Hono

## Goal

Get the Hono server running locally with a single route, proving the TypeScript toolchain works end-to-end.

## Scope

### In scope
- Install Hono and its Node.js adapter
- Install `tsx` as the dev runner
- A single `GET /` route returning the string `"AgentClinic is open for business"`
- A working `npm run dev` command that starts a live-reloading server on port 3000
- TypeScript compiles without errors (`npm run build`)

### Out of scope
- JSX templates or HTML responses (that's Phase 2)
- Any database or data layer (Phase 3+)
- CSS or layout (Phase 2)
- Tests (introduced when there is logic worth testing)

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Node adapter | `@hono/node-server` | Required to run Hono on Node.js; explicit over magic |
| Dev runner | `tsx` | Zero-config TS execution; `--watch` flag gives live reload |
| Response type | Plain text for now | No layout exists yet; JSX support wired in tsconfig for Phase 2 |
| Port | `3000` | Local convention; no env config needed at this stage |

## Constraints

- Must satisfy Mary's TypeScript requirement — no `any` shortcuts, no `// @ts-ignore`
- Keep `dependencies` lean: only what this phase actually needs
