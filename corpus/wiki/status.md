---
summary: A dated snapshot of which projects run, what was checked, and the open findings
updated: 2026-11-13
---

# Status

Snapshot of 2026-11-01. None of the five is deployed or in active development.

| Project | Runs | Checked on 2026-11-01 |
|---|---|---|
| git-helper-ui | yes | `npm run dev` and a diff of a demo repo; `npm run build` passes after adding `client/src/vite-env.d.ts`. Docker not tried |
| pw-manager | yes | `npm install`, `npm run rebuild`, `npm run typecheck`, a vault created and filled under `xvfb-run`. Before the preload fix the window stayed blank |
| literally-a-todo-app | yes | both dev servers, tasks added through the API, `npm run build`. `npm run lint` reported 2 errors. On 2026-11-11 `npm run check` passes (typecheck, ESLint with the house config, Prettier, knip, dependency-cruiser; the two convention checkers warned then), see [decisions](decisions.md). Since the Base UI brief, `npm run check` also runs vitest, Base UI sits under `components/ui/`, the drag handle works with mouse and touch, and sonner is gone. Since brief 04 (2026-11-11) the frontend is on Tailwind 4.3.5 with one stylesheet, has a Light / Dark / System switch, keeps an error toast until it is dismissed, and its phone header no longer overlaps; `check-base-ui` runs strict and `better-tailwindcss` is in `check`. Since brief 05 (2026-11-11) the backend is in the house code structure (`buildApp`, `config.ts`, `features/todos/`, a zod schema on every route, one error plugin), `npm test` in `backend/` runs 21 vitest tests, and `check-structure` runs strict. Since brief 06 (2026-11-13) the frontend wears the Greenbar sheet redesign: new tokens and Azeret Mono, a 720 px sheet with a sticky head band, greenbar rows, a ⋮ menu on touch, and the theme switch in the header; `npm run check` and 30 e2e specs pass; since brief 07 (2026-11-13) the icon font is self-hosted |
| fai-project-tsp-astar-mst | yes | `python main.py` prints `1 5 4 2 3 1 16`, the optimum for `test_graph.txt` |
| tomato-detection-computer-vision | yes | the `main.py` pipeline on `tomato1.jpg` with OpenCV 5. `ui.py` not tried, no Tkinter in the container |

## Open findings

- [Brief 08](../briefs/todo/08-the-tsp-solver-returns-the-optimal-tour.md): on `graph.txt` the solver prints a tour of 338, while the optimum is 334.
