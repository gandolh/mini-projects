# fai-project-tsp-astar-mst
Created a solution for TSP (Travel Salesman Problem) using A*. The heuristic method represents the total cost of the MST computed with Prim's Algorithm.
Input data looks like:
n m
i1 j1 w1
i2 j2 w2
...
in jn wn,
where w1 < w2 < ... < wn.


If an edge appears twice in the file, the last weight counts. `graph.txt` does this for the edges 1-2, 1-3, 1-4 and 1-5 (3, 5, 7, 8 first, then 75, 77, 80, 82), so its optimal tour weighs 334 with those four heavy weights.

# Tests

`python -m unittest` runs `test_tsp.py`: the optimum of `graph.txt` (334) and of `test_graph.txt` (16), and a brute-force cross-check on small random graphs.
