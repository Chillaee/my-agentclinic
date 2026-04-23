# Validation — Phase 1: Hello Hono

## Checks required before merging to `main`

### 1. Dev server starts
```
npm run dev
```
- Server starts without errors
- Terminal shows the server is listening (e.g. `Server is running on port 3000`)

### 2. Route responds correctly
```
curl http://localhost:3000/
```
- HTTP status: `200`
- `Content-Type` header includes `text/html`
- Body contains `<h1>` with the clinic name
- Body contains the strapline text

### 3. TypeScript build passes
```
npm run build
```
- Exits with code `0`
- No type errors in output

### 4. No `any` or type suppressions
- Grep confirms no `@ts-ignore`, `@ts-expect-error`, or untyped `any` in `src/`

```
grep -rn "any\|@ts-ignore\|@ts-expect-error" src/
```
- Should return no results (or only intentional, reviewed cases)

### 5. Dependencies are minimal
- `package.json` `dependencies` contains only what Phase 1 needs: `hono`, `@hono/node-server`
- `tsx` and `typescript` are in `devDependencies`

## Definition of done

All five checks pass. The branch is clean, committed, and ready for PR against `main`.
