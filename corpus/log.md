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

## [2026-11-10] todo | Briefs 03-05 for the todo app: Base UI conventions, Tailwind with a theme switch, the server in the code structure

Completes the set begun with briefs 01-02. Brief 03 audits the frontend against
Base UI rules 1-13 and fixes the drag handle, brief 04 moves it to Tailwind v4
(Postern's legacy-layer method, a dry run for the estate) with a Light / Dark /
System switch, and brief 05 gives the Fastify server `buildApp`, `config.ts`, zod
route schemas and a first test. They build the owner's answers of 2026-11-10 on
visual parity (close enough) and dark mode (a switch, light by default).

## [2026-11-10] todo | Briefs 02-05 revised to the grilling's answers; redesign brief 06 added

Revised briefs 02-05 for the owner's answers and technical calls of 2026-11-10.
Brief 02: `house-style` is vendored with a `house-style:sync` script (Q6), Prettier
width 120 with its measured cost (+198 / -194 frontend, +63 / -61 backend, Q8 and
Q51), `!` an error in source and a warning in tests (Q47), named component exports
(Q49), and the reorder check as a Playwright spec (Q60). Brief 03: the filter is a
`RadioGroup`, not `Tabs`, since it switches what one list shows (Q41, Q57), and
jsdom tests are only for wrappers with logic (Q60). Brief 04: the 14 px moves onto
`body` with Tailwind's default spacing (Q44), token names kept for this app
(Q17, Q61), the switch shares the filter's `RadioGroup`, and its decisions are
marked decided. Brief 05: its decisions are marked decided (Q23-Q27, Q43, Q55,
Q56). Added brief 06, a redesign with Hallmark on the estate board (Q39).

## [2026-11-10] done | Brief 01 — Base UI 1.9.0 in the todo frontend

`@base-ui/react` 1.4.1 to 1.9.0, pinned exactly (95f1e3a); `@base-ui/utils` 0.5.0, and `@babel/runtime` moved to 8.1.0 in the lockfile. Build passes; lint shows the same two `TodoList.tsx` errors as before. Browser behaviour check not run (no dev servers), so no behaviour differences are recorded and the drag question stays open for brief 03.
