# Log

## [2026-11-01] maintenance | Corpus bootstrapped, README and docs refreshed, two builds fixed

The corpus started with CLAUDE.md, routing.md, lint.sh, the overview and the status page, which point to each project's own notes instead of copying them. The root README follows the readme-docs standard now, with three images from the running apps and `docs/README.md`, `docs/getting-started.md` and `docs/images/shots.md`; pw-manager and the todo app got short READMEs of their own. Two fixes made the projects run as written: pw-manager's window stayed blank because its sandboxed preload required `../shared/api.js`, and git-helper-ui's client build failed on its CSS imports without `vite-env.d.ts`. Two findings went to `todos/`. Checked by running every project; the details are in [wiki/status.md](wiki/status.md).
