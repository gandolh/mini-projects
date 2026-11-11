# Task 05: The todo app's server in the house code structure

**Depends on:**

- In this repo: brief 02, for the gate, `eslint-plugin-n`'s `no-process-env` (a warning until this brief), the backend's ESLint config, the typecheck script and `.claude/rules/server.md`.
- In the owner's skills library:
  - brief 03, *A code-structure skill for the Fastify + React apps*: rules 1-11, the `server-skeleton.md` reference, `zod-type-provider.md`, `migrating-a-server.md`, `check-structure.mjs`, and the dependency-cruiser and knip presets;
  - brief 16, *The Fastify servers adopt the code structure*: this repo's row ("`server.ts`, no `app.ts`; flat; add `buildApp` and a first test") and the method;
  - brief 15, *Enforce the base-ui and code-structure skills in every repo*: `check-structure` runs `--warn-only` until this brief is done.
- The owner's grilling of 2026-11-10 and its technical calls: Q1 (how a service starts, a fact), Q23 (`features/`), Q24 (plugin options, explicit registration), Q25 (response schemas), Q27 (test runner), Q43 (error bodies), Q53, Q55 (where schemas live without a `shared/`) and Q56 (no decorators as a test seam).

**Runs after:** brief 02. It touches nothing in `frontend/`, so it may run beside briefs 03 and 04. The two projects have separate lockfiles.

**Before you start:** run `brief-board guide` ([CLAUDE.md](../../CLAUDE.md)).

## Context

The owner asked on 2026-11-09 for one researched code structure, enforced in every repo. The todo app's server is the smallest in the estate: three files and 100 lines (`wc -l backend/src/*.ts`: `db.ts` 17, `routes.ts` 70, `server.ts` 13). This brief gives it the shape the others get, scaled to one feature: an app factory that never listens, one config reader, route schemas with a response schema on every route, one error plugin, and a first test.

### What the server is today (read 2026-11-10)

Paths are under `literally-a-todo-app/backend/`.

- **`src/server.ts`** (13 lines) builds Fastify with `{ logger: true }` (line 4), registers `todoRoutes` (6) and calls `listen({ port: 3000, host: '127.0.0.1' })` (8). There is no `app.ts`, so nothing can start the app without opening the port.
- **`src/routes.ts`** (70 lines) holds the one `todoRoutes` plugin and five routes, all SQL inline, and the `Todo` interface (line 4).
- **`src/db.ts`** (17 lines) opens `todos.db` **at import time** (line 6, `path.join(__dirname, '../../todos.db')`, which is `literally-a-todo-app/todos.db`), runs `CREATE TABLE IF NOT EXISTS` (8-15) and **default-exports** the handle (17). Any file that imports it opens the real database, so a test can't use an in-memory one.
- **No environment reads.** `grep -rn "process.env" src` prints nothing. The port, host and database path are literals (`server.ts:8`, `db.ts:6`). So the config rule has nothing to centralise, and `config.ts` adds the first readers.
- **zod is not in the backend at all.** `backend/package.json` has `fastify` and `better-sqlite3` and nothing else at run time, and `grep -n zod backend/package-lock.json` prints nothing. The frontend's lockfile has zod 4.4.1, but only as an optional peer of `eslint-plugin-react-hooks`. So **adopting zod 4 is part of this brief**, with no zod 3 to move off.
- **Fastify 5.8.5** resolves in `backend/package-lock.json`, better-sqlite3 11.10.0, TypeScript 5.9.3 (brief 02 raises it to 6.0.3). `@fastify/type-provider-zod` 1.0.3 needs `fastify ^5.5.0` and `zod >=4.2.0`, so no Fastify bump.
- **No `shared/`.** The two projects share nothing, and the frontend's `types.ts` (`Todo`, `Filter`) is hand-written. So the zod schemas live in the backend (Q55, decision 3).
- **Run through `tsx`, no build.** `dev` is `tsx watch src/server.ts` and `start` is `tsx src/server.ts` (`backend/package.json`). There is no Docker, no deploy and no container (Q1's answer concerns the services that have one). So there is no `CMD` to change.

### The entry file: what the rename step means here

The skills library's rule 1 says `server.ts` is the only file that calls `listen`, and its migration step renames an `index.ts` to `server.ts`. **This repo's entry is already `server.ts`, so nothing is renamed**, and the two scripts, the docs and the one-line mentions stay as they are. What changes is the file's job: today it builds the app and listens; afterwards it loads the config, calls `buildApp`, listens and wires shutdown. The mentions to update are prose: `docs/wiki/backend-rules.md:5` ("Fastify setup only") and `docs/wiki/architecture.md:13` ("creates Fastify instance, registers routes, listens"). The dev server in the Vite proxy (`frontend/vite.config.ts:7-9`, `http://127.0.0.1:3000`) keeps working because the defaults are unchanged.

### Every route: 5, with the behaviour measured today

Measured on a scratch copy with `app.inject()` against the unchanged `routes.ts` (an in-process probe, never run in the repo; `better-sqlite3` wrote a scratch `todos.db`, removed after). Statuses and bodies:

| Request | Today | After this brief (default) |
|---|---|---|
| `POST /api/todos` `{ "title": " a " }` | 201, the row, title trimmed | the same |
| `POST` `{}` | 400 `{"error":"title is required"}` | the same |
| `POST` `{ "title": 5 }` | **500**, Fastify's default body, message `title.trim is not a function` | 400 `{"error":"title is required"}` |
| `POST` with no body | **500**, message `Cannot destructure property 'title' of 'req.body'…` | 400 `{"error":"title is required"}` |
| `PATCH /:id` `{ "completed": 1 }` | 200, `completed` 1 | the same |
| `PATCH /:id` `{ "completed": true }` | 200, `completed` 1 | the same |
| `PATCH /:id` `{ "title": "  " }` | 400 `{"error":"title cannot be empty"}` | the same |
| `PATCH /:id` with no body | **500**, `Cannot read properties of undefined (reading 'title')` | 200, the row unchanged |
| `PATCH /abc` `{}` | 404 `{"error":"not found"}` | the same |
| `PATCH /reorder` `{ "ids": [] }` | 400 `{"error":"ids must be a non-empty array"}` | the same |
| `PATCH /reorder` `{ "ids": ["x"] }` | **200** `{"ok":true}`, nothing updated | 400 `{"error":"ids must be a non-empty array of integers"}` |
| `PATCH /reorder` `{ "ids": [1] }` | 200 `{"ok":true}` | the same |
| `DELETE /api/todos/99` | 404 `{"error":"not found"}` | the same |
| `DELETE /api/todos/1` | 204 | the same |
| an unknown URL | Fastify's default 404 body (`statusCode`, `error`, `message`) | 404 `{"error":"not found"}` |

The five routes, with the schemas this brief writes in `features/todos/schemas.ts`:

| Route | params | body | response |
|---|---|---|---|
| `GET /api/todos` | | | `200`: `z.array(todoSchema)` |
| `POST /api/todos` | | `{ title: string }` | `201`: `todoSchema`; `400`: `errorSchema` |
| `PATCH /api/todos/reorder` (registered before `/:id`) | | `{ ids: integer[], min 1 }` | `200`: `{ ok: true }`; `400`: `errorSchema` |
| `PATCH /api/todos/:id` | `{ id: string }` | `{ title?: string, completed?: boolean or 0 or 1 }` | `200`: `todoSchema`; `400`, `404`: `errorSchema` |
| `DELETE /api/todos/:id` | `{ id: string }` | | `204`; `404`: `errorSchema` |

`todoSchema` is `{ id: integer, title: string, completed: 0 or 1, position: integer }`, the frontend's `Todo` (`frontend/src/types.ts`). Declare only the statuses a handler sends itself (the skills library's Round 8 fact: a declared status the handler never sends becomes a 500 if a hook sends it).

**Two traps in these schemas:**

- **`completed` is not only a boolean.** The route's generic says `completed?: boolean` (`routes.ts:62`), but the frontend sends `0 | 1` (`frontend/src/api/todos.ts:16`, `useTodos.ts`), and the handler accepts both by truthiness (line 70). A `z.boolean()` would answer every tick with a 400 and break the app. The body schema takes `z.union([z.boolean(), z.literal(0), z.literal(1)])`. A transform on input is fine (the provider only throws on a transform in a *response* schema), but the union needs none: the handler maps it to 0 or 1.
- **The `:id` stays a plain string.** The handler keeps `Number(req.params.id)` and its 404 for `abc` (`routes.ts:48-50`), so a regex in the schema, which would turn it into a 400, stays out.

### The move map: every file under `backend/src/`

| Today | Lines | Target | Note |
|---|---|---|---|
| `server.ts` | 13 | `server.ts` | config → `buildApp` → `listen`, with `close-with-grace`. The only caller of `listen`. |
| (new) | | `app.ts` | `buildApp(config)` returns the Fastify instance and never listens. Registers, in order: the errors plugin, the provider's compilers, then `todos`. Opens the database and closes it in an `onClose` hook. |
| (new) | | `config.ts` | `loadConfig(env = process.env)`, parsed once with zod: `PORT` (default 3000), `HOST` (default `127.0.0.1`), `DATABASE_PATH` (default the file `db.ts:6` builds today). The only reader of `process.env`, and it never reads `NODE_ENV`. |
| `db.ts` | 17 | `db/open.ts` | `openDb(path)` returns a handle and runs the `CREATE TABLE IF NOT EXISTS`. No import-time side effect and no default export. |
| `routes.ts` | 70 | `features/todos/routes.ts` + `features/todos/store.ts` | Routes become a `FastifyPluginAsyncZod<TodoContext>`. The SQL moves into `createTodoStore(db)`: `list`, `get`, `create`, `update`, `reorder`, `remove`. The `Todo` interface becomes the inferred schema type. |
| (new) | | `features/todos/schemas.ts` | the schemas above, backend-only (Q55). |
| (new) | | `plugins/errors.ts` | the error plugin below, wrapped in `fastify-plugin`. |
| (new) | | `testing/buildTestApp.ts` | `buildApp` on an in-memory database, closed after each test. |

With one feature the `features/` folder looks heavy, and the library's tree asks for it anyway (Q23). The default keeps it, so the next route group has a place. If the owner says a flat `routes.ts` and `store.ts` is better for a one-feature server, the same split holds at `src/` level; only the folder is dropped.

### The error plugin

`plugins/errors.ts`, registered first. It **keeps the repo's body, `{ "error": "<message>" }`** (`docs/wiki/backend-rules.md`, Error Responses; Q43), so the frontend, which never reads it, and the rules file are unchanged. In order:

1. a zod validation error from the provider (`hasZodFastifySchemaValidationErrors`) → 400, `error` the first issue's message. The schemas set the five messages in the table through zod's `error` option, so those strings are unchanged;
2. a response serialisation error (`isResponseSerializationError`) → 500 `{ "error": "internal error" }`, logged with the method and URL;
3. a 4xx Fastify raised itself → its status and message;
4. anything else → 500 `{ "error": "internal error" }`, logged, no detail to the client. Today's 500s send the exception's message (the table's three rows).

A `setNotFoundHandler` returns 404 `{ "error": "not found" }`. It isn't rate-limited: `@fastify/rate-limit` is not a dependency, and the skills library asks for it only where it is present.

### Dependencies this brief adds (all pinned exactly)

`zod` 4.6.7 (latest on 2026-11-10; any 4.x from 4.2 works), `@fastify/type-provider-zod` 1.0.3, `fastify-plugin` 6.0.1, `close-with-grace` 2.5.0, and the provider's two required peers, `@fastify/swagger` 9.9.3 and `openapi-types` 12.1.3 (type-only weight; the lockfile diff shows them). Dev: `vitest` (Q27's default; the version is the latest at build time, pinned). `dependency-cruiser` and `knip` come from brief 02's preset.

## Decisions

Items marked "decided" are final. The rest are defaults this brief builds.

1. **`features/<name>/`** (decided 2026-11-10, technical call, Q23). One folder, `features/todos/`.
2. **Typed plugin options, explicit registration** (decided 2026-11-10, technical call, Q24 and Q56). The plugin takes `{ db }` as its options (a `TodoContext`), and `app.ts` registers it by name. No decorators as a test seam (tests pass dependencies as plugin options), no autoload.
3. **Where the schemas live** (decided 2026-11-10, technical call, Q55). A zod schema lives in `shared/` when the client imports it, otherwise in its feature folder. There is no `shared/` here and the frontend keeps its hand-written `types.ts`, so the schemas are `features/todos/schemas.ts`, in the backend. If the owner later wants one source, that is a `shared/` workspace and a new brief; this repo has no workspaces.
4. **A response schema on every route** (decided 2026-11-10, technical call, Q25). None of the five routes sends pass-through JSON, so no loose object is needed, and none is a stream or a binary route (Q53 exempts those). The row's columns are exactly the four the schema lists, so the schema strips nothing today.
5. **The error body** (decided 2026-11-10, technical call, Q43). One error handler, keeping the repo's body, `{ "error": "<message>" }`. It passes Fastify's own 4xx through with their status and message, and never echoes a thrown message to the client (step 3 of the plugin list below, and the 500 rows of the table).
6. **Behaviour changes, accepted.** Default: the five rows in the table that change (a non-string title, a missing body, a non-integer id in `ids`, the unknown-URL body, and the 500 message). Each was a 500 or a silent no-op, and nothing in the frontend depends on them. *New question: is turning `ids: ["x"]` into a 400 wanted?*
7. **The test runner** (decided 2026-11-10, technical call, Q27 and Q26). vitest, with `inject()`. atrium alone stays on `node:test`. The skills library's "nothing boots the app" decision (Q26) belongs to Shelfmark. Brief 02 adds no vitest to the backend, so it is added here. (Brief 03 adds it to the frontend, for wrappers only.)
8. **The test helper's name.** Default: `testing/buildTestApp.ts`, as the skill names it. There are no tests to rename.
9. **Timeouts and `trustProxy`.** Default: neither is set. The server listens on loopback only, behind no proxy, and no route runs long. Fastify's defaults stay. Record that in the decision entry.
10. **Shutdown.** Default: `close-with-grace`, closing the app, and an `onClose` hook that closes the SQLite handle. `tsx watch` restarts through the same signals.
11. **Logging.** Default: Fastify's JSON logger as today, no `pino-pretty`.
12. **Fastify.** Default: stays at 5.8.5. A bump goes with the estate's next one.
13. **`.env` files.** Default: `config.ts` reads the process environment only. The app has no secrets and no `.env`, so there is no loader to fail quietly (the Round 8 fact about env loaders doesn't apply).

## Files you OWN

- `backend/src/**`: the moves and the new files.
- `backend/package.json` and `backend/package-lock.json`: the new dependencies, a `test` script (`vitest run`), and `typecheck` as brief 02 left it. `dev` and `start` stay on `tsx src/server.ts`.
- `backend/tsconfig.json`, only if the new folders need an `include` change (`src` already covers them).
- `backend/eslint.config.js`: `no-process-env` from warning to error, and `config.ts` as its one exception; `.dependency-cruiser.cjs` (new, from the skill's preset) at `literally-a-todo-app/`.
- `literally-a-todo-app/package.json` (brief 02's scripts-only file): `check:conventions` gains dependency-cruiser, and `check-structure` loses its `--warn-only`.
- `literally-a-todo-app/.claude/rules/server.md`: the structure lines.
- `literally-a-todo-app/docs/wiki/backend-rules.md` (file responsibilities, adding a route, the error section) and `architecture.md:13`; `api.md` only where a status or message changed.
- `scripts/conventions.json` at `literally-a-todo-app/`, for any exception.
- Corpus: `wiki/decisions.md` (brief 02 creates it), [wiki/status.md](../../wiki/status.md), [log.md](../../log.md).

## Files you must NOT touch

- `frontend/`. A response schema that drops a field the frontend reads is a finding: fix the schema, not the frontend. The frontend's one reader of a message is none, so no change is expected.
- The `todos` table and the `todos.db` file. Position rules stay as `backend-rules.md` has them: 1-based, new rows at `MAX(position) + 1`, reorder as a full replacement.
- Behaviour beyond the table. Status codes and bodies for valid requests stay exactly as measured.
- The other four projects.

## What to do

Follow the skill's `migrating-a-server.md`. One commit per step. After each, `npx tsc --noEmit` passes in `backend/`, `npm run check` passes in `literally-a-todo-app/backend`, and `npm start` serves `GET /api/todos` on 127.0.0.1:3000.

1. **Before.**
   - Run `check-structure` strict and record its counts by rule.
   - Re-run the probe behind the table above, on a scratch copy, and keep its output. Save it as the "before" JSON. Seed a scratch database with six tasks and save `GET /api/todos` too.
2. **`config.ts`, `db/open.ts` and the split.** Add the dependencies in this step: `zod`, `close-with-grace`. `openDb(path)` replaces `db.ts`; `app.ts` holds `buildApp(config)`; `server.ts` loads the config, builds, listens and calls `close-with-grace`. Routes still use the old handlers, passed the handle. `no-process-env` becomes an error here, with `config.ts` excepted. `GET /api/todos` returns what it did.
3. **The first test**, before any schema work: `testing/buildTestApp.ts` and `features/todos/routes.test.ts` pinning every row whose result is the same in both columns of the table (10 of the 15). It passes on the old behaviour and must pass unchanged on the new. The 5 rows that change are added in step 6. Add `vitest` and the `test` script.
4. **The store.** Move the SQL into `features/todos/store.ts`. The route file calls it. Tests still pass.
5. **The error plugin, the not-found handler and the type provider.** Add `fastify-plugin`, `@fastify/type-provider-zod` and its two peers. `app.ts` sets `setValidatorCompiler` and `setSerializerCompiler`. Register the plugin first.
6. **The schemas, one route per commit,** in this order: `GET`, `POST`, `reorder` (before `/:id`), `PATCH /:id`, `DELETE`. Each commit:
   - declares params, body and response, with the statuses the handler sends;
   - removes the handler's manual validation (`routes.ts:20-21`, `:32-35`, `:53`);
   - types the plugin as `FastifyPluginAsyncZod<TodoContext>`;
   - adds the tests for the rows that change.
7. **After.**
   - Run the probe again and diff it against step 1. Only the table's changing rows differ. Any other difference is a bug.
   - Check the frontend against the new server: both dev servers, then add, tick, rename, reorder and delete one task, and read the network responses.
   - Add the new tests: an extra column on a row is stripped from a reply (a test store returning an extra field); a reply that fails its schema is a 500 `{ "error": "internal error" }` with no detail; the 500 message of a thrown error never reaches the client.
8. **Strict.** Add `.dependency-cruiser.cjs`, drop `check-structure`'s `--warn-only`, and put dependency-cruiser in `check:conventions`. Check that a deliberate import of `db/open.js` from `plugins/errors.ts` fails it (the rule is the skill's, "no cross-layer reach"; use whichever boundary the preset defines) and revert.
9. **Corpus.**
   - Add to `wiki/decisions.md` (brief 02 creates it): "The todo server in the house code structure", with what was rejected (a flat `routes.ts` kept as is, `@fastify/autoload`, TypeBox, a `shared/` workspace) and why, and the timeouts line from decision 9.
   - Update `.claude/rules/server.md`, `backend-rules.md`, `architecture.md`, `api.md`, [wiki/status.md](../../wiki/status.md) and [log.md](../../log.md). The log entry holds the before and after probe summary and the `check-structure` counts, for the skills library's brief 16 table.
   - Run `bash corpus/lint.sh --index`, then `bash corpus/lint.sh`, until clean.

## Acceptance

- [ ] `check-structure` passes **strict**, with any exception in `scripts/conventions.json` and its reason. Its counts before and after are in the log, for the skills library's brief 16 row.
- [ ] `grep -rn "process\.env" literally-a-todo-app/backend/src --include=*.ts | grep -v "\.test\.ts"` prints only `config.ts`, and `no-process-env` is an error.
- [ ] `grep -rn "listen(" literally-a-todo-app/backend/src` prints only `server.ts`, and `app.ts` exports `buildApp` and never calls it.
- [ ] Every one of the five routes has a `schema` with a `response`, and `grep -rnE "req\.body|request\.body" literally-a-todo-app/backend/src --include=*.ts | grep -v "\.test\."` shows reads of the validated body only.
- [ ] `npm test` in `literally-a-todo-app/backend` passes on a fresh clone with no build step. It covers all 15 rows of the behaviour table, the stripped field, the serialisation 500 and the not-found body.
- [ ] A `PATCH` with `{ "completed": 1 }` and with `{ "completed": true }` both return 200. A test for each.
- [ ] The before and after probe diff shows only the changing rows, and is in the log.
- [ ] dependency-cruiser fails on a deliberate boundary violation and passes clean.
- [ ] `npm start` serves the app on 127.0.0.1:3000, the frontend works against it, and Ctrl-C ends the process with the database closed.
- [ ] `npm run check` passes in `literally-a-todo-app/backend`, and `bash corpus/lint.sh` ends clean.

## Interplay

- Brief 02 leaves `no-process-env` as a warning and `check-structure` as `--warn-only`; this brief turns the first into an error and drops the second flag.
- Brief 02 turns `no-default-export` on, but its list of fixes doesn't name `backend/src/db.ts:17`, the backend's default export. If brief 02 left it, this brief's step 2 removes it, since `db/open.ts` has none.
- The skills library should hear two things from this app: the Round 8 trap that a schema stricter than the handler (`completed: boolean`) breaks the client, and that a server with no environment reads still gets a `config.ts`.

**Update 2026-11-11 (brief 02 landed):** dependency-cruiser is already in `check:conventions` (a root `.dependency-cruiser.cjs`, no rule lowered, 0 findings), and `n/no-process-env` is a dated warning block in `backend/eslint.config.js` as the brief says (nothing reads the environment yet; `config.ts` is exempt in the house config). What this brief keeps: that block goes, `check-structure --warn-only` comes off here, and `config.ts` is the exempt reader. Run knip, ESLint and the checkers per project; the tools live in the app folder's `package.json`.

## Outcome (2026-11-11)

Built on `main`, after the house-style 1.2.0 sync (`dd92b54`). The commits run from `65dc42d` (config, `buildApp`, `server.ts`) to the strict `check-structure` commit. `npm run check` in `literally-a-todo-app/` exits 0 (25 s): typecheck, ESLint, Prettier, the frontend's tests, the backend's 21 vitest tests, knip, dependency-cruiser, `check-base-ui` and `check-structure` strict with 0 findings. Acceptance: `process.env` is read only in `config.ts` (the grep prints the one line) and `no-process-env` is an error again; `listen(` appears only in `server.ts`; five routes, five `schema:` with a response; the three `req.body` reads are of validated bodies; `PATCH` with `{ "completed": 1 }` and with `true` both return 200 (a test); a deliberate `lib/` import of fastify and a cross-feature import of `store.ts` each failed dependency-cruiser and were reverted; `tsx src/server.ts` served all five routes with the frontend's payload shapes on a spare port and a scratch database, and a SIGINT ended it with exit 0.

- **Reply capture:** 34 requests, before and after each step (in the log). The splits changed none; the error plugin 7, the schemas 5 (4 of them again); the 8 that differ at the end are the table's five rows plus reorder with no body, Fastify's bad-JSON body and the unknown-method 404. Dropping `position` from `todoSchema` once changed the list reply, so the schema is live.
- **Tests:** 21 in `config.test.ts`, `features/todos/routes.test.ts` and `replies.test.ts`: the 15 table rows (the changing ones added with their schema), a stripped column, a reply that fails its schema (500, no detail) and a thrown error whose message stays out of the reply.

### Deviations

- **`PATCH /:id` keeps a blank-title check in the handler,** not the schema, so a missing task still answers 404 before a blank title answers 400 (the brief listed `routes.ts:53` for removal). `title: 5` and `completed: "yes"` are new 400s, "title must be a string" and "completed must be a boolean, 0 or 1" (the brief's table had no row for them; both were a 500 or a silent coercion).
- **Fastify's own 400 (bad JSON) now has the body `{ "error": "<message>" }`,** not Fastify's default (`statusCode`, `code`, `error`, `message`), because the one error handler writes one body (Q43).
- **Every 500 body is `{ "error": "internal error" }`.** The frontend reads no message, so no client text changes.
- **No `ApiError` class and no `lib/`:** the handlers send their own 400 and 404, so there is nothing to throw. The skill's skeleton has `ApiError` for handlers that throw.
- **No rate-limited 404, no `trustProxy`, no timeouts:** the server is undeployed, on loopback, with no `@fastify/rate-limit` (decision 9).
- **Files outside the brief's list:** the root `package.json` (`check` runs the backend's tests; `--warn-only` went), `backend/package.json`'s `test` script and `vitest` 5.1.0 (the frontend's version), and `corpus/index.md` (regenerated).
- **The frontend was not run against the new server** (no dev servers, to keep the machine light): the capture and the real-server run used the frontend's exact payloads (`api/todos.ts`), and its e2e specs mock the API.
- **`exactOptionalPropertyTypes` stays off** (from the sync): the frontend has one finding, `components/ui/RadioGroup.test.tsx:17`; the backend has none.

### Handoff for dependents

- **Run it:** `npm run dev` or `npm start` in `backend/` (still `tsx`, no build); `npm test` there runs vitest. Settings: `PORT`, `HOST`, `DATABASE_PATH` (a bad `PORT` throws a `ConfigError` before the app exists).
- **Versions, pinned:** zod 4.6.7, `@fastify/type-provider-zod` 1.0.3, `fastify-plugin` 6.0.1, `close-with-grace` 2.5.0, `@fastify/swagger` 9.9.3 and `openapi-types` 12.1.3 (the provider's peers), vitest 5.1.0. Fastify stays 5.8.5.
- **The contract:** every status and body for a valid request is as before; the changed replies are in the log and decisions.
