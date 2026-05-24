# git-helper-ui

GitLab-style diff viewer for any local git repository. Point it at a repo path, pick two branches, and browse the diff file-by-file (`base...compare`, same as GitLab MRs).

## Stack

- **Server** ([server/](server/)) — Node 20+, Express 5, simple-git, TypeScript (ESM). Runs on `:5174`.
- **Client** ([client/](client/)) — React 19 + Vite 8 + TypeScript. Renders diffs with `diff2html` + `highlight.js`. Runs on `:5173`, proxies `/api` to the server.

All versions in `package.json` are pinned (no `^` / `~`).

## Run it

This is an npm-workspaces monorepo. Install once at the root, then run both apps with a single command:

```bash
npm install
npm run dev
```

That runs server (`:5174`) and client (`:5173`) in parallel. Open http://localhost:5173, paste an absolute path to any git repo, click **Load branches**, pick base + compare, click **Compare**.

To run just one side: `npm run dev:client` or `npm run dev:server`.

For a containerized single-port build (UI + API on `:3020`), see [infra/](infra/).

## API

- `POST /api/branches` — `{ repoPath }` → `{ current, local[], remote[] }`
- `POST /api/diff` — `{ repoPath, baseBranch, compareBranch }` → file list with status (A/M/D/R/C/T) and `+/-` line counts
- `POST /api/file-diff` — `{ repoPath, baseBranch, compareBranch, filePath }` → unified-diff patch for one file (lazy-loaded on click)

The diff range is always `base...compare` (three-dot, from the merge-base), matching GitLab's MR behavior.
