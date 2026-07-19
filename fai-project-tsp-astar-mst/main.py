from graph import graph_from_file
from tspSolver import TSPSolver


def main():
    graph_path = "test_graph.txt"
    graph = graph_from_file(graph_path)
    start_vertex = 1
    solver = TSPSolver(graph, start=start_vertex)
    path, total_cycle_cost = solver.solve()

    # Output format: i1 i2 ... in i1 w
    # The cycle is (i1 i2 ... in i1) of total weight w.
    output_numbers = path + [path[0]] + [total_cycle_cost]
    print(" ".join(str(x) for x in output_numbers))


if __name__ == "__main__":
    main()

