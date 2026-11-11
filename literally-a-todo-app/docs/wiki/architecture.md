# Architecture

## Overview

Monorepo with two top-level directories: `backend/` and `frontend/`. A single SQLite database file (`todos.db`) lives at the repo root.

## Backend

- **Runtime:** Node.js with ESM (`"type": "module"` in package.json)
- **Framework:** Fastify 5
- **Database:** better-sqlite3 (synchronous SQLite driver)
- **Language:** TypeScript, compiled on-the-fly with `tsx`
- **Entry point:** `backend/src/server.ts` — loads the config, builds the app with `buildApp`, listens on `127.0.0.1:3000`
- **App:** `backend/src/app.ts` — `buildApp(config)`: zod compilers, the errors plugin, the todo feature; never listens
- **Routes and SQL:** `backend/src/features/todos/` — `routes.ts`, `schemas.ts`, `store.ts`
- **DB layer:** `backend/src/db/open.ts` — `openDb(path)` returns a `better-sqlite3` handle and runs `CREATE TABLE IF NOT EXISTS`
- **Tests:** vitest with `app.inject()` through `testing/buildTestApp.ts` (`npm test` in `backend/`)

## Frontend

- **Framework:** React 19
- **Build tool:** Vite 8
- **Language:** TypeScript
- **Entry point:** `frontend/src/main.tsx`
- **Status:** Scaffold only — `App.tsx` is the default Vite starter, not yet wired to the backend API

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS todos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  title     TEXT    NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,  -- 0 = false, 1 = true
  position  INTEGER NOT NULL             -- 1-based ordering
)
```

## Key Decisions

- **SQLite over Postgres:** Single-user local app; no need for a separate DB process.
- **better-sqlite3 (sync) over async drivers:** Simplifies route handlers — no await needed for DB calls, no connection pool.
- **tsx over tsc+node:** Faster dev loop; no separate compile step.
- **Fastify over Express:** Better TypeScript support, built-in schema validation hooks available for future use.
