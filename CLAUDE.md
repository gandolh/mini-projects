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

## What the wiki is NOT

- Not a replacement for git history or commit messages
- Not a place for in-progress task state or session notes
- Not auto-updated — always requires explicit "update the wiki" trigger
