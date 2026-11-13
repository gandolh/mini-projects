import itertools
import os
import random
import tempfile
import unittest

from graph import Graph, graph_from_file
from tspSolver import TSPSolver

HERE = os.path.dirname(os.path.abspath(__file__))


def tour_cost(graph, path):
    cycle = path + [path[0]]
    return sum(graph.weight[(a, b)] for a, b in zip(cycle, cycle[1:]))


def brute_force(graph, start=1):
    others = [v for v in range(1, graph.n + 1) if v != start]
    return min(tour_cost(graph, [start, *p]) for p in itertools.permutations(others))


def random_graph(rng, n):
    # A complete graph with random weights; the file format needs a text round trip.
    lines = [f"{n} {n * (n - 1) // 2}"]
    for i in range(1, n + 1):
        for j in range(i + 1, n + 1):
            lines.append(f"{i} {j} {rng.randint(1, 20)}")
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as f:
        f.write("\n".join(lines) + "\n")
    try:
        return graph_from_file(f.name)
    finally:
        os.unlink(f.name)


class TSPSolverTest(unittest.TestCase):
    def solve_file(self, name):
        graph = graph_from_file(os.path.join(HERE, name))
        path, cost = TSPSolver(graph, start=1).solve()
        return graph, path, cost

    def check_tour(self, graph, path, cost):
        self.assertEqual(sorted(path), list(range(1, graph.n + 1)), "visits every city once")
        self.assertEqual(path[0], 1)
        self.assertEqual(tour_cost(graph, path), cost, "reported cost is the tour's weight")

    def test_graph_txt_optimum_is_334(self):
        # The solver once printed 338 here: it returned the first complete path it popped, before the
        # edge back to the start was part of its cost.
        graph, path, cost = self.solve_file("graph.txt")
        self.check_tour(graph, path, cost)
        self.assertEqual(cost, 334)

    def test_test_graph_optimum_is_16(self):
        graph, path, cost = self.solve_file("test_graph.txt")
        self.check_tour(graph, path, cost)
        self.assertEqual(cost, 16)

    def test_matches_brute_force_on_small_random_graphs(self):
        rng = random.Random(2026)
        for _ in range(60):
            n = rng.randint(3, 8)
            graph = random_graph(rng, n)
            path, cost = TSPSolver(graph, start=1).solve()
            self.check_tour(graph, path, cost)
            self.assertEqual(cost, brute_force(graph), f"n={n}")


if __name__ == "__main__":
    unittest.main()
