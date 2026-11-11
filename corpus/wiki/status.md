---
summary: A dated snapshot of which projects run, what was checked, and the open findings
updated: 2026-11-11
---

# Status

Snapshot of 2026-11-01. None of the five is deployed or in active development.

| Project | Runs | Checked on 2026-11-01 |
|---|---|---|
| git-helper-ui | yes | `npm run dev` and a diff of a demo repo; `npm run build` passes after adding `client/src/vite-env.d.ts`. Docker not tried |
| pw-manager | yes | `npm install`, `npm run rebuild`, `npm run typecheck`, a vault created and filled under `xvfb-run`. Before the preload fix the window stayed blank |
| literally-a-todo-app | yes | both dev servers, tasks added through the API, `npm run build`. `npm run lint` reported 2 errors. On 2026-11-11 `npm run check` passes (typecheck, ESLint with the house config, Prettier, knip, dependency-cruiser; the two convention checkers warn), see [decisions](decisions.md). Since the Base UI brief, `npm run check` also runs vitest, Base UI sits under `components/ui/`, the drag handle works with mouse and touch, and sonner is gone |
| fai-project-tsp-astar-mst | yes | `python main.py` prints `1 5 4 2 3 1 16`, the optimum for `test_graph.txt` |
| tomato-detection-computer-vision | yes | the `main.py` pipeline on `tomato1.jpg` with OpenCV 5. `ui.py` not tried, no Tkinter in the container |

## Open findings

- [todo-header-overlaps-on-phones](../todos/todo-header-overlaps-on-phones.md): the todo app's title runs into its tabs at phone width, (its two lint errors were fixed on 2026-11-11).
- [tsp-solver-misses-the-optimum-on-graph-txt](../todos/tsp-solver-misses-the-optimum-on-graph-txt.md): on `graph.txt` the solver prints a tour of 338, while the optimum is 334.
