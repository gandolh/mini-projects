# Task 08: The TSP solver returns the optimal tour on graph.txt

**Depends on:** nothing. **Runs before:** nothing. **Origin:** the todo `tsp-solver-misses-the-optimum-on-graph-txt` (2026-11-01), promoted on 2026-11-13 and removed from `todos/`.

**Before you start:** run `brief-board guide` ([corpus/CLAUDE.md](../../CLAUDE.md)).

## Context

With `graph_path = "graph.txt"` in `fai-project-tsp-astar-mst/main.py`, the solver prints `1 10 4 7 2 8 5 3 6 9 1 338`. Trying every order of the other nine cities (362,880) gives 334, and `result.md` records a tour of 334 from an earlier run. A* with an admissible heuristic returns an optimal tour, so something in the search or the heuristic is wrong. On the five-city `test_graph.txt` the answer, 16, is optimal.

`graph.txt` says 49 edges, but ten cities have only 45. Edges 1-2, 1-3, 1-4 and 1-5 appear twice (3, 5, 7, 8, then 75, 77, 80, 82). `graph.py` keeps both copies in `edges` and the last one in `weight`, so the brute force and the solver both use the last weight; `edges` is unused by the solver.

## Decisions

Decided 2026-11-13 (controller): find the real cause and fix it. A heavier search that hides the bug is not a fix. The duplicate edges stay as they are, with the README saying the last weight counts.

## Files you OWN

- `fai-project-tsp-astar-mst/tspSolver.py` (and `mstHeuristic.py` if it is the cause), a new test file, `README.md` (how to run the tests, which weight counts).
- Corpus: [wiki/status.md](../../wiki/status.md), [log.md](../../log.md).

## Files you must NOT touch

- `graph.txt`, `test_graph.txt`, every other project.

## What to do

1. Reproduce: `python main.py` on `graph.txt` prints 338. Read the solver and the heuristic and say what is wrong.
2. Fix it at the cause.
3. Add a test (stdlib `unittest`, no new dependency) that pins 334 on `graph.txt` and 16 on `test_graph.txt`, plus a brute-force cross-check on small random graphs with a fixed seed.

## Acceptance

- [ ] The outcome note names the bug.
- [ ] `python main.py` with `graph.txt` prints a tour of weight 334 that is a valid cycle with that weight.
- [ ] The tests pass and fail on the old solver (the pin on `graph.txt`).
- [ ] `bash corpus/lint.sh` ends clean.
