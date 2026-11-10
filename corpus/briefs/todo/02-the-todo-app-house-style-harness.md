# Task 02: The todo app in the house style, with a quality harness

**Depends on:**

- In this repo: brief 01, so the lockfile diff of the reformat is not mixed with the Base UI bump.
- In the owner's skills library:
  - brief 27, *A house style, and a quality harness that enforces it*: the `house-style` package at `v1.0.0` (this repo holds a vendored copy of it, decision 1), the `house-style` skill, and the plugin's `Stop` and `PostToolUse` hooks;
  - brief 15, *Enforce the base-ui and code-structure skills in every repo*: how the convention checkers are wired and when they run `--warn-only`.
- The owner's grilling of 2026-11-10 and its technical calls: Q5-Q14, Q45 (Markdown), Q46 (a root `CLAUDE.md`), Q47-Q50 and Q60. Every question is answered; the decisions below record each.

**Runs before:** 03, 04 and 05. The reformat touches all 18 TypeScript and JavaScript files of the app, and those briefs rewrite most of them. Formatting first gives one clean reformat commit.

**Before you start:** run `brief-board guide` ([CLAUDE.md](../../CLAUDE.md)).

## Context

On 2026-11-09 the owner made three calls for every web app: Base UI 1.9.0 everywhere, whole apps on Tailwind v4, and the researched conventions enforced in each repo. Brief 27 of the library measured the house style and found it consistent but unenforced. Its answer is a two-layer harness: the repo's `check` and `check:fast` scripts, and the Claude Code layer (the plugin's `Stop` and `PostToolUse` hooks, `.claude/rules/`, a short `CLAUDE.md`). This brief adopts both for `literally-a-todo-app`, which is two independent npm projects with no root `package.json`.

### What the app has today (read 2026-11-10)

- **Two projects, two lockfiles, no workspaces.** `literally-a-todo-app/frontend` (React 19.2.5, Vite 8.0.10, TypeScript 6.0.3) and `literally-a-todo-app/backend` (Fastify 5.8.5, better-sqlite3 11.10.0, TypeScript 5.9.3, `tsx` 4.21.0). Nothing is shared between them, so no build has to run before a typecheck or test.
- **Scripts.**
  - Frontend: `dev`, `build` (`tsc -b && vite build`), `lint` (`eslint .`), `preview`.
  - Backend: `dev` (`tsx watch src/server.ts`), `start` (`tsx src/server.ts`). No `build`, no `typecheck`, no `test`, no linter and no formatter. Production runs the source through `tsx`.
  - **No `test` script in either project, and no test file.** So there is nothing for a `pretest` to build, and a fresh clone's `npm test` can't fail for a missing build. Step 5 proves it.
- **tsconfig.**
  - `frontend/tsconfig.app.json` already has `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals`, `noUnusedParameters` and `noFallthroughCasesInSwitch`. `tsconfig.node.json` has the same.
  - `backend/tsconfig.json` has `strict`, `module` and `moduleResolution` `NodeNext`, `esModuleInterop`, `skipLibCheck`, `outDir` and `rootDir`. Nothing else. It has no `noEmit`.
- **ESLint** (`frontend/eslint.config.js`, 18 lines): `@eslint/js` recommended, `typescript-eslint` recommended untyped (8.59.1), `react-hooks` 7.1.1 recommended and `react-refresh` vite. The backend has no ESLint.
- **Style.**
  - Frontend files use single quotes and semicolons, except `frontend/vite.config.ts` and `frontend/eslint.config.js` (no semicolons).
  - Backend files use single quotes and **no semicolons** (`grep -c ";$" backend/src/*.ts` prints 0 for all three).
  - The house style is double quotes and semicolons, so every file with a string changes. `mini-projects` isn't among Q9's named outliers (Newspapper, ro-housing, sports-app, imbatranim-apps), though both packages are. Q9 (technical call): the outliers move to double quotes and semicolons in their one reformat commit, so both packages do.
- **Claude Code files.** `literally-a-todo-app/CLAUDE.md` (57 lines) holds the wiki-bootstrap and "update the wiki" rules, and ends with "Always respond in caveman mode" and the `caveman` skill. `literally-a-todo-app/.claude/skills/caveman` and `.windsurf/skills/caveman` exist, pinned by `skills-lock.json`. There is no `.claude/rules/`, no `.claude/settings.json`, and the repo-wide [corpus/CLAUDE.md](../../CLAUDE.md) says a project folder's own `CLAUDE.md` wins inside that folder.
- **No `.npmrc`**, so no `save-exact`. Dependencies are `^` ranges.
- **No Docker, no CI, no deploy.** The app runs locally (API on 127.0.0.1:3000, Vite on 5173 proxying `/api`, `frontend/vite.config.ts:7-9`).

### Measured on 2026-11-10

Taken on scratch copies of `frontend/` and `backend/` in the session scratchpad, after `npm ci` there, never in the repo. Tools: Prettier 3.8.1, TypeScript 6.0.3, ESLint 10.2.1, typescript-eslint 8.59.1, knip 5.88.1.

**Prettier churn.** Defaults (double quotes, semicolons), `trailingComma: "all"`, on `*.ts`, `*.tsx`, `*.js` and `*.css`. `frontend/src/App.css` is left out: it is the Vite template's stylesheet, 184 lines, and nothing imports it (`frontend/src/main.tsx:3` imports only `./index.css`; the built CSS is 0.86 kB). Command per cell: `prettier --write` with the width, then `git diff --shortstat`.

| `printWidth` | Frontend (15 of 15 files) | Backend (3 of 3 files) |
|---|---|---|
| 100 | +249 / -189 | +70 / -61 |
| **120** | **+198 / -194** | **+63 / -61** |
| 130 | +187 / -203 | +60 / -63 |

The frontend is 760 lines of TypeScript plus 55 of CSS; the backend is 97. 130 is the least churn in both, but the estate's one width is **120** (Q8 and Q51), which costs 11 more changed lines in the frontend and 3 in the backend than 130 does. At 120 the one-off reformat is +198 / -194 in the frontend and +63 / -61 in the backend; the commit is ignored in blame (step 2). Markdown and JSON weren't measured: they are out of scope (decision 3).

**TypeScript flags.**

| Project | Flag added | Errors |
|---|---|---|
| frontend | `noUncheckedIndexedAccess` | **4**: `frontend/src/components/TodoList.tsx:30`, `:78`, `:79`, `frontend/src/hooks/useTodos.ts:80` |
| frontend | `noImplicitOverride`, `exactOptionalPropertyTypes` | 0, 0 |
| backend (TypeScript 5.9.3, then 6.0.3) | baseline | 0, 0 |
| backend | each of `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters` | 0 each |

The four frontend errors are real. `useTodos.ts:80` is the reorder update: `ids.map((id, i) => ({ ...byId[id], position: i })).filter(Boolean)`. When `byId[id]` is missing it builds an object with only `position`, and `.filter(Boolean)` can't drop it, because the object is truthy. The three `TodoList.tsx` hits are `splice` and index reads that assume the index is valid.

**ESLint.**

- Untyped, as configured: **2 errors**, in 1.7 s. `react-hooks/set-state-in-effect` at `frontend/src/components/TodoList.tsx:17` (`setItems(todos)` inside an effect), and `react-hooks/immutability` at `frontend/src/components/TodoList.tsx:105` (`draggingIndex.current = index`, a ref passed in as a prop and written in the child).
- The six typed rules, through `projectService`, plus `no-non-null-assertion`, with `switch-exhaustiveness-check` at `considerDefaultExhaustiveForUnions: true`:
  - **frontend: 1 finding**, `no-non-null-assertion` at `frontend/src/main.tsx:9` (`document.getElementById('root')!`), in 2.3 s;
  - **backend: 2 findings**, both `no-unnecessary-type-assertion`: `backend/src/routes.ts:14` (`.all() as Todo[]`) and `backend/src/routes.ts:58` (`.get(id) as Todo`). Check that each is truly unneeded before removing it: better-sqlite3's `all()` and `get()` return `unknown[]` and `unknown`, so if the rule is right, `@types/better-sqlite3` types them wider than that. Step 1 confirms.
- `no-floating-promises`, `no-misused-promises`, `await-thenable`, `switch-exhaustiveness-check` and `consistent-type-imports`: 0 findings in both.

**knip** (frontend): `App` unused export at `frontend/src/App.tsx:9` and a duplicate export, `App` and `default`, at `frontend/src/App.tsx:9` and `:77`. Backend: nothing beyond the packages the scratch run itself added.

**The house shapes.** Counted with `grep -rnE "\benum\b|: any\b|as any|@ts-|TODO|FIXME|console\."` over `frontend/src`, `backend/src` and the frontend configs, plus `grep -rn "export default"`:

| Shape | Count | Where |
|---|---|---|
| `enum`, `any`, `@ts-*`, `TODO`/`FIXME` | 0 | |
| `console` | 0 | the backend logs through `app.log` (Fastify's logger) |
| non-null `!` | 1 | `frontend/src/main.tsx:9` |
| default exports | 4 | `frontend/src/App.tsx:77` (also a named export of the same component, line 9), `backend/src/db.ts:17`, `frontend/vite.config.ts:4`, `frontend/eslint.config.js:8` (the last two are configs) |
| `process.env` / `import.meta.env` | 0 | the port, host and database path are literals (`backend/src/server.ts:8`, `backend/src/db.ts:6`) |

**Not measured:** `@vitest/eslint-plugin` (there are no tests), lint time with `project` against `projectService`, and `better-tailwindcss` (brief 04's).

## Decisions

Items marked "decided" are final. The rest are defaults this brief builds.

1. **Where the configs come from** (decided 2026-11-10, technical call, Q6). `house-style` is **vendored**: a copy under `literally-a-todo-app/vendor/house-style/` with a version header (`v1.0.0`), refreshed by a `house-style:sync` script in the app's scripts-only `package.json`, which finds the `house-style` checkout by name. No git, `github:` or tarball dependency, so the rule is the same in every repo, Docker or not.
2. **Width** (decided 2026-11-10, technical call, Q8 and Q51). `printWidth` is **120**. The measured table above is kept, and the reformat at 120 (+198 / -194 frontend, +63 / -61 backend) is the one-off cost, taken in one commit that blame ignores.
3. **Markdown stays out of Prettier** (decided 2026-11-10, technical call, Q45). `.prettierignore` lists `*.md`.
4. **tsconfig** (decided 2026-11-10, technical call, Q11 and Q50).
   - frontend: add `noUncheckedIndexedAccess` and fix its four errors; the rest is already there. Q50 defers that flag to a later brief where it needs one. Here it is four errors in the frontend and none in the backend, so it is taken in this brief with those counts, not deferred;
   - backend: add `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` and `noEmit` (0 errors each, measured), and raise TypeScript to 6.0.3 pinned (clean, measured). The backend's 5.9.3 is already past 5.8, so `erasableSyntaxOnly` needs no bump first, and there are no parameter properties to turn into fields. `exactOptionalPropertyTypes` stays out until after a count (Q11).
   - frontend: add `noUncheckedIndexedAccess` and fix its four errors; the rest is already there;
   - backend: add `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` and `noEmit` (0 errors each, measured), and raise TypeScript to 6.0.3 pinned (clean, measured). `exactOptionalPropertyTypes` stays out (Q11).
5. **Typed lint** (decided 2026-11-10, technical call, Q12, Q47 and Q48). The six rules plus `no-non-null-assertion` through `projectService`, with `switch-exhaustiveness-check` at `considerDefaultExhaustiveForUnions: true`. `no-non-null-assertion` (`!`) is an **error in source and a warning in tests**. `no-floating-promises` names `node:test`'s `describe`, `it` and `test` in `allowForKnownSafeCalls` in the preset; this app uses vitest, so it never matters here.
6. **The house shapes as errors** (decided 2026-11-10, technical call, Q13 and Q49). All errors. The one `!` is fixed, not excepted. `console` is allowed in scripts and CLIs (none here). A default export is allowed only where a framework needs one: the two config files. Components use named exports, so `App` keeps its named export and `main.tsx` imports it.
7. **`check:fast`** (decided 2026-11-10, technical call, Q10). A typecheck plus ESLint on changed files, in each project, built incrementally (`tsc -b` where the project allows). Target 15 s, accepted up to about 30 s where `tsc` alone is slower.
8. **The Claude Code layer** (decided 2026-11-10, technical call, Q7). The plugin's hooks: `Stop` runs `check:fast`, `PostToolUse` formats the saved file.
9. **Where the harness lives.** Default: each project gets its own `check` and `check:fast`, and the app folder gets a **scripts-only `package.json`** at `literally-a-todo-app/package.json` whose `check` and `check:fast` call into the two projects with `npm --prefix`. comercial-website already does this (its root `package.json` has no dependencies). The `Stop` hook runs `check:fast` in the session's working directory, so it only finds it when Claude Code is opened in `literally-a-todo-app/`. *New question for the grilling:* the repo root, `mini-projects/`, holds five unrelated projects. Does the owner open sessions there, and should the hook skip it?
10. **`.claude/rules/` location.** Default: `literally-a-todo-app/.claude/rules/`, beside the app's `CLAUDE.md` and its `skills/` folder. Whether Claude Code loads a nested `.claude/rules/` when a session starts at the repo root is **not verified**. Step 6 ends with a check the owner runs. *New question for the grilling.*
11. **The app's `CLAUDE.md`.** Default: extend the existing `literally-a-todo-app/CLAUDE.md` with the commands and the hard rules, keep its wiki-bootstrap, and do not create a second file. Its closing line, "Always respond in caveman mode", is the owner's choice and is left alone. *New question for the grilling:* does the house `unslop` style apply to this app's prose, or does caveman mode win?
12. **Two lint errors and the drag bug are in scope for fixing, not for rewriting; the test is a Playwright spec** (decided 2026-11-10, technical call, Q60). jsdom tests are only for wrappers that hold logic (brief 03 adds vitest for those); a flow stays in Playwright. The reorder check is a flow, so it is a Playwright spec in `frontend/e2e/` that mocks `/api/todos` with `page.route`, with `@playwright/test` pinned as a dev dependency and a `test:e2e` script. Step 4 fixes `TodoList.tsx:105` by moving the ref into `DraggableTodoItem` (the parent never reads it: `TodoList.tsx:15` declares it, line 39 passes it, and only `DraggableTodoItem` reads or writes it, so behaviour is equal), and step 4 fixes `TodoList.tsx:17` by deleting the `items` mirror state. The second is a behaviour-touching change: `useReorderTodos.onMutate` (`useTodos.ts:76-85`) already updates the query cache optimistically, which is what `items` re-creates by hand. Step 4 therefore adds the spec before it deletes anything.

## Files you OWN

- `literally-a-todo-app/frontend/tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `package.json`, `package-lock.json`, and the new `frontend/e2e/` spec with its Playwright config.
- `literally-a-todo-app/backend/tsconfig.json`, `package.json`, `package-lock.json`, and a new `eslint.config.js`.
- New: `literally-a-todo-app/package.json` (scripts only, with `house-style:sync`), `literally-a-todo-app/vendor/house-style/` (the vendored copy), `.prettierrc`, `.prettierignore`, `.git-blame-ignore-revs`, and `scripts/changed-files.mjs` if the package ships none.
- The reformat: whitespace and quote changes to every `*.ts`, `*.tsx`, `*.js` and `*.css` file of the app.
- The fixes the new rules ask for: `frontend/src/main.tsx:9`, `frontend/src/components/TodoList.tsx` (lines 15, 17, 30, 78, 79, 105), `frontend/src/hooks/useTodos.ts:80`, `frontend/src/App.tsx` (the double export), `backend/src/routes.ts:14, 58` if confirmed.
- New: `literally-a-todo-app/.claude/rules/web.md` and `server.md`; edits to `literally-a-todo-app/CLAUDE.md`.
- The `frontend/src/App.css` deletion (dead, see above).
- Corpus: `corpus/wiki/decisions.md` (create it if absent, with `summary:` and `updated:`), [wiki/status.md](../../wiki/status.md), [log.md](../../log.md).

## Files you must NOT touch

- Behaviour, apart from the fixes listed above.
- The other four projects. `git-helper-ui`, `pw-manager` and the two Python projects get no config here.
- `literally-a-todo-app/docs/wiki/`, except that a changed command is updated where it is quoted (`frontend-rules.md`, `backend-rules.md`).
- The skills library and the `house-style` repo. A rule that seems wrong for this app is reported back, not patched locally.
- Styling and Base UI wrappers: briefs 03 and 04.

## What to do

One commit per step. After each, the gate is `npm run build` in `frontend/`, `npx tsc --noEmit` in `backend/`, and `npm run lint` in `frontend/` (which shows only the two known errors until step 4).

1. **Measure again** with the real configs, and record in the `log.md` entry: step 1's counts above, lint time with `projectService` against `project`, `npx knip` from the `house-style` preset, and whether `routes.ts:14, 58` really are unneeded casts (remove one on a scratch copy and run `tsc`). Any rule that finds more than about 20 real problems goes back to the owner.
2. **Prettier and the reformat.**
   1. Add `prettier` (pinned) to each project, the config (`printWidth: 120` per decision 2, `trailingComma: "all"`), and `.prettierignore` with `*.md`, `dist/`, `node_modules/`, `package-lock.json`, `todos.db` and `public/`.
   2. Add `format` and `format:check` scripts. Commit alone.
   3. Delete `frontend/src/App.css`. Commit alone, as `chore: remove the unused Vite template stylesheet`. `git grep -n "App.css" literally-a-todo-app` must show only docs.
   4. Run `npm run format`. Commit only that, as `style: format with Prettier`.
   5. Add that commit's full hash to `.git-blame-ignore-revs`, in its own commit. Hand the owner `git config blame.ignoreRevsFile .git-blame-ignore-revs`.
3. **tsconfig.** Decision 4, with the four frontend fixes:
   - `TodoList.tsx:30`, `:78`, `:79`: guard the `splice` result and the two index reads;
   - `useTodos.ts:80`: build the reordered list from ids that exist, so `byId[id]` is never spread when it is `undefined`, and delete `.filter(Boolean)`.
   - Backend: add a `typecheck` script (`tsc`) and keep `dev` and `start` on `tsx`.
4. **ESLint.**
   - Frontend: extend the house config. Roots: web is `frontend/src`; the config files are `vite.config.ts` and `eslint.config.js` (`*.config.*`, the only default exports allowed).
   - Backend: a new `eslint.config.js` from the same preset, server root `backend/src`.
   - Fix the findings: `main.tsx:9` (look the root up and throw a named error if it is missing, or use the house helper if the preset ships one), `App.tsx` (keep the named export and drop the default one, per decision 6, and update the import in `main.tsx:5`), `routes.ts:14, 58`, and the two react-hooks errors by decision 12. Before deleting `items`, write the reorder spec (up and down buttons, with `/api/todos` mocked through `page.route`, run against the Vite dev server) and see it pass on the old code and on the new.
   - Diff in effect: the six typed rules, `no-non-null-assertion`, `no-restricted-syntax` on `TSEnumDeclaration`, `no-warning-comments` (`todo`, `fixme`, pointing at `corpus/todos/`), `no-console` and `no-default-export` outside `*.config.*` go from off to error. `no-process-env` (from `eslint-plugin-n`) goes on in the backend as a warning, because brief 05 adds the only reader, `config.ts`, and turns it into an error.
5. **The gate.**
   - Each project: `check` (`typecheck`, `lint`, `format:check`, `test` where it exists) and `check:fast` (`typecheck`, then ESLint on the files changed against `HEAD` plus untracked ones; no shell-only syntax, the owner works under WSL).
   - `literally-a-todo-app/package.json`: `check` and `check:fast` call both projects, and `check:conventions` runs knip. `check-base-ui` and `check-structure` run `--warn-only` until briefs 03 and 05 are done.
   - **The fresh-clone proof:** `rm -rf node_modules && npm ci && npm run check` in each project, on a scratch clone. It must pass with no build step first.
   - Time `check:fast` warm with one changed file, and `check` in full, and record both.
6. **`.claude/rules/` and `CLAUDE.md`.** Each rules file stays under about 40 lines.
   - `web.md` (`paths: ["literally-a-todo-app/frontend/src/**"]`): read the `base-ui` skill and [literally-a-todo-app/docs/wiki/frontend-rules.md](../../../literally-a-todo-app/docs/wiki/frontend-rules.md); `@base-ui/react` only through `components/ui/` wrappers, from subpaths; API calls only through `api/todos.ts`; sharp corners, no shadows, no gradients ([literally-a-todo-app/docs/wiki/design-rules.md](../../../literally-a-todo-app/docs/wiki/design-rules.md)). Brief 04 adds the Tailwind lines.
   - `server.md` (`paths: ["literally-a-todo-app/backend/src/**"]`): the error body is `{ "error": "<message>" }`; routes before `/:id`; ESM with `.js` import suffixes; one `db` handle; the position rules ([literally-a-todo-app/docs/wiki/backend-rules.md](../../../literally-a-todo-app/docs/wiki/backend-rules.md)). Brief 05 adds the structure lines.
   - `CLAUDE.md`: add a Commands block (`npm run check` before every hand-back, `check:fast`, one test with `npx vitest run <file>`, the two dev servers and their ports) and the places that mislead (the backend is run by `tsx`, there is no build; the database file is `literally-a-todo-app/todos.db`, gitignored; `npm install` runs per project). Keep it under about 60 lines in total.
   - Hand the owner the load check from decision 10: open Claude Code in `mini-projects/`, edit a file under `literally-a-todo-app/frontend/src/`, and run `/memory`. If `web.md` isn't listed, move the rules to a `.claude/rules/` at the repo root with the same `paths:`.
7. **Corpus.** Add the `corpus/wiki/decisions.md` entry "The todo app in the house style, formatted and checked" (width, config source, what was rejected, why). Update [wiki/status.md](../../wiki/status.md) and [log.md](../../log.md). Run `bash corpus/lint.sh --index`, then `bash corpus/lint.sh`, until clean.

## Acceptance

- [ ] `npm run check` passes in `literally-a-todo-app/frontend` and `literally-a-todo-app/backend`, and from `literally-a-todo-app/` for both. The fresh-clone proof of step 5 passes in each. The times for `check` and for `check:fast` (warm, one changed file) are in the log entry, with `check:fast` under about 15 s.
- [ ] `npx prettier --check .` passes in both projects. `git diff -w <hash>^ <hash>` for the reformat commit shows only quote and semicolon changes, and the hash is in `.git-blame-ignore-revs`.
- [ ] `grep -rn "noUncheckedIndexedAccess" literally-a-todo-app/*/tsconfig*.json` shows both projects. `npx tsc --noEmit` passes in the backend and `npx tsc -b` in the frontend.
- [ ] `npm run lint` exits 0 in both projects: the two react-hooks errors are gone, with the reorder Playwright spec passing before and after the change.
- [ ] A deliberate `enum`, `!`, `console.log`, `// TODO` and a new `export default` each fail `npm run lint`. Revert them after.
- [ ] `literally-a-todo-app/.claude/rules/web.md` and `server.md` exist with `paths:` frontmatter, and the app's `CLAUDE.md` lists `npm run check`.
- [ ] `git grep -n "App.css" -- literally-a-todo-app/frontend/src` prints nothing.
- [ ] `bash corpus/lint.sh` ends clean.

## Interplay

- Brief 03 drops `check-base-ui`'s `--warn-only` once the wrappers are in `components/ui/`. Brief 04 adds `better-tailwindcss`. Brief 05 turns `no-process-env` into an error and drops `check-structure`'s `--warn-only`.
- The reformat changes `frontend/src/index.css` slightly; brief 04 deletes it.
- The drag handle's lead from brief 01 is not fixed here. Brief 03 owns it.
