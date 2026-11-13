---
paths:
  - "literally-a-todo-app/backend/src/**"
---

# The API (`backend/src`)

- Read [docs/wiki/backend-rules.md](../../literally-a-todo-app/docs/wiki/backend-rules.md) before you add or change a route.
- Errors are `{ "error": "<message>" }` with 400, 404 or 204; never a raw string.
- A route that conflicts with `/:id` (such as `/reorder`) is registered before it.
- Structure: `server.ts` listens and nothing else does; `app.ts` exports `buildApp(config)`; `config.ts` is the only
  reader of `process.env`; `db/open.ts` opens the file; `features/todos/` holds `routes.ts`, `schemas.ts`, `store.ts`
  and `index.ts`; `plugins/errors.ts` is the one error handler; tests use `testing/buildTestApp.ts` and `inject()`.
- Every route declares a `schema` with `params`, `body` and a `response` for each status the handler sends. The
  handler reads the validated body and parses nothing. A schema stricter than the handler breaks the client
  (`completed` is a boolean, 0 or 1).
- ESM with `.js` import suffixes. One database handle, from `openDb` in `buildApp`, used only inside `store.ts`.
- The database calls are synchronous (better-sqlite3): no `await` on them. Multi-statement writes go in
  `db.transaction`.
- Positions are 1-based and reordering replaces the whole order: send the full array of ids.
- Settings go through `config.ts` (`PORT`, `HOST`, `DATABASE_PATH`), the only reader of `process.env`.
- `check-structure` runs strict (0 findings). A finding that must stay goes in `scripts/conventions.json` with its reason.
