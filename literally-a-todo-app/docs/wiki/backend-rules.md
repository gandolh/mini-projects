# Backend Rules & Conventions

## File Responsibilities

Under `backend/src/`:

- `server.ts` — the process: loads the config, builds the app, wires `close-with-grace` and calls `listen`. The only file that listens.
- `app.ts` — `buildApp(config, options)` returns the Fastify instance and never listens. It sets the zod compilers, registers the errors plugin, then the todo feature, and closes the database in an `onClose` hook.
- `config.ts` — `loadConfig(env)`, the only reader of `process.env`: `PORT` (3000), `HOST` (127.0.0.1), `DATABASE_PATH` (`todos.db` in the app folder).
- `db/open.ts` — `openDb(path)` opens the file and creates the table. No import-time side effect, no default export.
- `features/todos/` — the feature: `routes.ts` (the five routes, thin), `schemas.ts` (zod, backend-only), `store.ts` (all the SQL), `index.ts` (what `app.ts` imports).
- `plugins/errors.ts` — the one error handler and the 404 handler, wrapped in `fastify-plugin`.
- `testing/buildTestApp.ts` — the whole app on an in-memory database, for `inject()` tests.

## Adding a New Route

1. Add the zod schemas to `features/todos/schemas.ts` (a new feature gets its own `features/<name>/` folder and one `register` line in `app.ts`).
2. Add the SQL to `features/todos/store.ts`; a route never writes SQL.
3. Add the route to `features/todos/routes.ts` with a `schema` that declares `params`, `body` and a `response` for every status the handler sends itself. The handler reads the validated `req.body` and parses nothing.
4. Routes that conflict with `/:id` params (e.g. `/reorder`) must be registered **before** `/:id` routes.
5. A schema stricter than the handler breaks the client: `completed` takes a boolean, 0 or 1 because the frontend sends 0 | 1.
6. Add an `inject()` test through `buildTestApp`.

## Error Responses

Always return `{ "error": "<message>" }` with the appropriate HTTP status:
- `400` — bad input
- `404` — resource not found
- `204` — successful delete (no body)

Never return raw strings or unstructured error objects.

`plugins/errors.ts` writes the same body for what the handlers do not send: a request that fails its schema is a `400` with the first issue's message, a Fastify 4xx (bad JSON) keeps its status and message, an unknown URL is `404 { "error": "not found" }`, and anything else is `500 { "error": "internal error" }` with the detail in the log only. A declared response schema for a status (`{ error: string }`) encodes every reply on that status, so it stays that shape.

## Database Access

- The handle comes from `openDb` in `buildApp` and reaches the routes as the plugin's `{ db }` option, inside `store.ts`. Never create a `Database` in a route.
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
- Import local files with `.js` extension (e.g. `import { openDb } from './db/open.js'`) — required for ESM Node.
- Run via `tsx` — no separate compile step needed in dev.
