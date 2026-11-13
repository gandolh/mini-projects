# CLAUDE.md

This file is read by Claude Code at the start of every session.

## Wiki Bootstrap

This repo maintains a living wiki under `docs/wiki/`. At the start of every session:

1. Read `docs/wiki/index.md` — get the map of all pages and when to load each
2. Read the last 5 entries of `docs/wiki/log.md` — understand what changed recently
3. Load specific pages on demand based on the current task (see index.md for guidance)

## Updating the Wiki

When the user says "update the wiki":

### Step 1 — Ingest new sources from `docs/ingest/`

1. Run `ls docs/ingest/` to list files
2. For each file present:
   a. Read the file
   b. Extract key information relevant to the project (architecture decisions, API changes, rules, design guidelines, etc.)
   c. Integrate the information into the appropriate wiki page(s) in `docs/wiki/` — update existing content, add new sections, or create a new page if the topic has no home yet
   d. Update `docs/wiki/index.md` if a new page was created
3. After all files are processed, delete them from `docs/ingest/` (they have been absorbed into the wiki)

### Step 2 — Sync with codebase changes

1. Run `git log --oneline` and compare the latest commit hash against the last entry in `docs/wiki/log.md` to identify new commits
2. Run `git diff <last-logged-commit>..HEAD --name-only` to see which files changed
3. Read the relevant diffs: `git diff <last-logged-commit>..HEAD -- <file>`
4. Update affected wiki pages in `docs/wiki/`
5. Update `docs/wiki/index.md` if any pages were added, removed, or renamed

### Step 3 — Append log entry

Append a new entry to `docs/wiki/log.md` using this format:

```
## [YYYY-MM-DD] <type> | <short description>

Summary: <1-2 sentences on what changed>

Pages touched: <comma-separated list of filenames>
```

Where `<type>` is one of: `feat`, `fix`, `refactor`, `docs`, `init`, `ingest`.

## Commands

Run them in `literally-a-todo-app/`. `npm install` runs in the app folder (the tools), `frontend/` and `backend/`.

- `npm run check`: typecheck, lint, format check and conventions for both projects. Run it before every hand-back.
- `npm run check:fast`: both typechecks, then ESLint on the changed files. The Stop hook runs it.
- `npm run format`: Prettier writes every file it covers (Markdown stays out).
- `npm test` in `frontend/`: vitest with jsdom, for the wrappers that hold logic (`check` runs it).
- The flow specs: `npm run test:e2e` in `frontend/` (the API is mocked; nothing else to start). `check` does not run them.
- Dev servers, in two terminals: `npm run dev` in `backend/` (127.0.0.1:3000) and in `frontend/` (5173, proxying `/api`).

## Places that mislead

- The backend is run by `tsx`; there is no build, and `tsc` only checks.
- The database is `todos.db` in this folder, gitignored.
- ESLint, Prettier, knip and dependency-cruiser are installed once, in the app folder, and `frontend/` and `backend/` use them. Their `check` needs the app folder's `npm install` first.
- `vendor/house-style/` is a generated copy: never edit it. `npm run house-style:sync` refreshes it.
- The vitest tests sit beside the code (`*.test.tsx`); the Playwright specs are in `frontend/e2e/`.
- The icon font comes from the network: offline, a glyph shows as its ligature word, clipped to its one-em box by `components/Icon.tsx`. `e2e/drag.spec.ts` blocks the font to prove a click still lands on its button.

## Hard rules

- No CI or GitHub automation. No pushes: commit locally, the owner pushes.
- Fix a finding of the house rules in code; a rule that looks wrong for this app is reported, not patched.

## Communication Style

Always respond in caveman mode: ultra-compressed, caveman speech, full technical accuracy. Use the `caveman` skill at the start of every session.

Caveman mode is for chat replies only (the owner, 2026-11-13). Anything written to a file (the wiki, docs, the corpus, code comments, commit messages) follows the house plain-English style of the `unslop` skill.

## Folder rules

The rules for `frontend/src` and `backend/src` live at the repo root, in `.claude/rules/web.md` and `.claude/rules/server.md`. A session opened at the repo root gets them by their `paths:`. In a session opened in this folder, read `../.claude/rules/web.md` or `../.claude/rules/server.md` before you edit `frontend/src` or `backend/src`.

## What the wiki is NOT

- Not a replacement for git history or commit messages
- Not a place for in-progress task state or session notes
- Not auto-updated — always requires explicit "update the wiki" trigger
