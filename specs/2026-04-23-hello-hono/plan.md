# Plan — Phase 1: Hello Hono

## Steps

1. **Install dependencies**
   - `hono` — the server framework
   - `tsx` — dev runner (devDependency)
   - `@hono/node-server` — Node.js adapter for Hono

2. **Update `package.json` scripts**
   - Add `"dev": "tsx watch src/index.ts"` for the dev server
   - Add `"start": "node dist/index.js"` for the production build

3. **Update `tsconfig.json`**
   - Set `"jsx": "react-jsx"` and `"jsxImportSource": "hono/jsx"` to enable Hono's JSX renderer (needed from Phase 2 onward; safe to configure now)
   - Ensure `"module"` and `"moduleResolution"` are compatible with ESM imports from Hono

4. **Rewrite `src/index.ts`**
   - Create a `Hono` app instance
   - Register a single `GET /` route returning plain text: `"AgentClinic is open for business"`
   - Serve via `@hono/node-server` on port `3000`

## Order of operations

Dependencies → tsconfig → src/index.ts → manual smoke test
