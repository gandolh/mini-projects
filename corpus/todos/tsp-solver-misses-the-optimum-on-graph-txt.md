---
title: The TSP solver prints a tour of 338 on graph.txt, while the optimum is 334
created: 2026-11-01
status: open
tags: [fai-project-tsp-astar-mst, correctness]
---

# The TSP solver prints a tour of 338 on graph.txt, while the optimum is 334

Found on 2026-11-01. With `graph_path = "graph.txt"` in [main.py](../../fai-project-tsp-astar-mst/main.py), the solver prints `1 10 4 7 2 8 5 3 6 9 1 338`. Trying every order of the other nine cities, 362,880 of them, gives 334, and [result.md](../../fai-project-tsp-astar-mst/result.md) records a tour of 334 from an earlier run. A* with an admissible heuristic returns an optimal tour, so something in the search or the heuristic changed. The last commit to the project, on 2026-01-29, is "Fix heuristic evaluate". On the five-city `test_graph.txt` the answer, 16, is optimal.

## Context

- [graph.txt](../../fai-project-tsp-astar-mst/graph.txt) says 49 edges, but ten cities have only 45. Edges 1-2, 1-3, 1-4 and 1-5 appear twice, first with 3, 5, 7 and 8, then at the end with 75, 77, 80 and 82. [graph.py](../../fai-project-tsp-astar-mst/graph.py) keeps both copies in `edges` and the last one in `weight`, so the spanning tree and the tour may see different weights.
- The brute force used the last weight of each pair, as `weight` does.

## Acceptance

`python main.py` on `graph.txt` prints a tour of weight 334, or `graph.txt` loses its duplicate edges and the README says which weight counts.
