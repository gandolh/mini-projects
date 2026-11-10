# Log

## [2026-11-01] maintenance | Corpus bootstrapped, README and docs refreshed, two builds fixed

The corpus started with CLAUDE.md, routing.md, lint.sh, the overview and the status page, which point to each project's own notes instead of copying them. The root README follows the readme-docs standard now, with three images from the running apps and `docs/README.md`, `docs/getting-started.md` and `docs/images/shots.md`; pw-manager and the todo app got short READMEs of their own. Two fixes made the projects run as written: pw-manager's window stayed blank because its sandboxed preload required `../shared/api.js`, and git-helper-ui's client build failed on its CSS imports without `vite-env.d.ts`. Two findings went to `todos/`. Checked by running every project; the details are in [wiki/status.md](wiki/status.md).

## [2026-11-10] todo | Briefs 01-02 for the todo app: Base UI 1.9.0 and the house-style harness (partial set)

These follow the owner's 2026-11-09 calls: Base UI at 1.9.0 styled with
Tailwind across whole apps, and the researched conventions enforced in each
repo. The writing stopped on a usage limit before the remaining briefs for
`literally-a-todo-app`:

- Base UI by the conventions: move `components/shared/` to `components/ui/`
  and audit rules 1-13;
- the frontend to Tailwind;
- the backend in the code structure.

The next session writes them, taking the owner's skills library's briefs
02, 03 and 14 as the specs and Almanac's briefs as the reference shape.
