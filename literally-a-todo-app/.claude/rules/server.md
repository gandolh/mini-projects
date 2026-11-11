---
paths:
  - "literally-a-todo-app/backend/src/**"
---

# The API (`backend/src`)

- Read [docs/wiki/backend-rules.md](../../docs/wiki/backend-rules.md) before you add or change a route.
- Errors are `{ "error": "<message>" }` with 400, 404 or 204; never a raw string.
- A route that conflicts with `/:id` (such as `/reorder`) is registered before it.
- ESM with `.js` import suffixes. One `db` handle, the named export of `db.ts`; never a second `Database`.
- The database calls are synchronous (better-sqlite3): no `await` on them. Multi-statement writes go in
  `db.transaction`.
- Positions are 1-based and reordering replaces the whole order: send the full array of ids.
- Nothing reads `process.env` yet; when a setting needs it, it goes through one `config.ts`, the only
  allowed reader.
- `check-structure` runs `--warn-only` until the server structure brief is done. Its findings today: no
  `app.ts`, and no schemas on the five routes.
