# Requirements — Phase 1: Hello Hono

## Goal

Get the Hono server running locally with a single route that renders a minimal home page, proving the TypeScript + JSX toolchain works end-to-end.

## Scope

### In scope

- Install Hono and its Node.js adapter
- Install `tsx` as the dev runner
- A single `GET /` route rendering an HTML home page via a JSX component
- Home page contains: a `<title>`, an `<h1>` with the clinic name, and a short strapline
- A working `npm run dev` command that starts a live-reloading server on port 3000
- TypeScript compiles without errors (`npm run build`)

### Out of scope

- Shared layout component (Phase 2)
- Any CSS beyond what the browser provides by default (Phase 2)
- Any database or data layer (Phase 3+)
- Tests (introduced when there is logic worth testing)

## Decisions

| Decision            | Choice               | Reason                                                         |
| ------------------- | -------------------- | -------------------------------------------------------------- |
| Node adapter        | `@hono/node-server`  | Required to run Hono on Node.js; explicit over magic           |
| Dev runner          | `tsx`                | Zero-config TS execution; `--watch` flag gives live reload     |
| Response type       | JSX → HTML           | Validates the JSX pipeline early; gives a real page to look at |
| Home page component | `src/pages/Home.tsx` | Establishes the pages directory convention for later phases    |
| Port                | `3000`               | Local convention; no env config needed at this stage           |

## Constraints

- Must satisfy Mary's TypeScript requirement — no `any` shortcuts, no `// @ts-ignore`
- Keep `dependencies` lean: only what this phase actually needs
