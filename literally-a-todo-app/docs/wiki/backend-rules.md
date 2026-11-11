# Backend Rules & Conventions

## File Responsibilities

- `backend/src/server.ts` — Fastify setup only. No business logic here.
- `backend/src/routes.ts` — All route handlers. Import db from `db.ts`. Define the `Todo` interface here.
- `backend/src/db.ts` — Single db instance, the named export `db`. Schema migrations go here as `db.exec(...)` calls.

## Adding a New Route

1. Add the handler to `backend/src/routes.ts` inside `todoRoutes`.
2. New routes that conflict with `/:id` params (e.g. `/reorder`) must be registered **before** `/:id` routes.
3. Always type the `Body`, `Params`, and `Querystring` generics on the route handler.

## Error Responses

Always return `{ "error": "<message>" }` with the appropriate HTTP status:
- `400` — bad input
- `404` — resource not found
- `204` — successful delete (no body)

Never return raw strings or unstructured error objects.

## Database Access

- Use the singleton from `db.ts` — never create a new `Database` instance in routes.
- Use `db.prepare(...).run()` for writes, `.get()` for single-row reads, `.all()` for multi-row reads.
- Wrap multi-statement writes in `db.transaction(...)`.
- Do not use async/await for DB calls — better-sqlite3 is synchronous.

## Position Ordering

- Todos are ordered by the `position` column (1-based integer).
- New todos are appended at `MAX(position) + 1`.
- Reordering is a full replacement: pass the complete ordered array of ids to `/api/todos/reorder`.
- Do not rely on `id` order for display ordering.

## TypeScript

- All files use ESM (`import`/`export`), not CommonJS.
- Import local files with `.js` extension (e.g. `import { db } from './db.js'`) — required for ESM Node.
- Run via `tsx` — no separate compile step needed in dev.
