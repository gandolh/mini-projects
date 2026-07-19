from typing import List
from graph import Graph

# MSTHeuristic = Minimum Spanning Tree Heuristic
# This class implements the MST heuristic for the TSP problem
class MSTHeuristic:
    def __init__(self, graph: Graph, start: int) -> None:
        self.graph = graph
        self.start = start

    # Compute the MST cost of a subset of nodes using Prim algorithm
    def mst_cost_subset(self, nodes_subset: List[int]) -> int:
        k = len(nodes_subset)
        if k <= 1:
            return 0

        INF = 10**18
        in_mst = [False] * k
        min_edge = [INF] * k

        # Start the MST from the first node in the subset. (arbitrary choice)
        min_edge[0] = 0
        total_cost = 0

        # Run Prim's algorithm to compute the MST cost. 
        # We do k iterations to get an MST with all the nodes in the subset.
        for _ in range(k):
            # Pick vertex that wasn't picked up yet and has the smallest connecting edge.
            v_index = -1
            best = INF
            for i in range(k):
                if (not in_mst[i]) and min_edge[i] < best:
                    best = min_edge[i]
                    v_index = i

            if v_index == -1:
                # Should not happen because the graph is complete, as it is defined in exercise,
                # but we'll guard it anyway.
                break

            # Mark the vertex as "in the MST" and add the edge weight to the total cost.
            in_mst[v_index] = True
            total_cost += best

            v = nodes_subset[v_index]

            # Update the best edges to connect remaining vertices in the subset.
            # Check if edges with the newly added vertex are better than the current best ones.
            for u_index, u in enumerate(nodes_subset):
                if in_mst[u_index]:
                    continue
                w = self.graph.weight[(v, u)]
                if w < min_edge[u_index]:
                    min_edge[u_index] = w

        return total_cost

    def evaluate(self, visited: List[int], current: int) -> int:
        # Compute the non-visited nodes
        remaining = []
        for v in range(1, self.graph.n + 1):
            if visited[v - 1] == 0:
                remaining.append(v)

        # If all nodes were visited, return 0
        if not remaining:
            return 0

        # Build the subset for MST: current node + remaining unvisited + start
        # This represents the nodes we still need to connect to complete the tour
        subset = set(remaining)
        subset.add(current)
        subset.add(self.start)

        return self.mst_cost_subset(list(subset))