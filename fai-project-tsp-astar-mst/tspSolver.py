
from typing import List, Tuple, Dict
import heapq
from graph import Graph
from mstHeuristic import MSTHeuristic


# TSPSolver = Traveling Salesman Problem Solver
class TSPSolver:
    def __init__(self, graph: Graph, start: int = 1) -> None:
        # Salesman graph
        self.graph = graph
        # start point
        self.start = start
        # MST Heuristic - evaluate method represents the hmst(n) function
        self.heuristic = MSTHeuristic(graph, start)

    # A* algorithm implementation
    def solve(self) -> Tuple[List[int], int]:
        n = self.graph.n
        start = self.start
        # Frequency array for what nodes have been visited. Initially filled with 0s.
        visited_start = [0] * n
        # Mark the start node as visited
        visited_start[start - 1] = 1


        initial_h = self.heuristic.evaluate(visited_start, start)
        # Priority queue elements: (f, g, current, visited_array, path)
        # f: total estimated cost f = g + h.
        # g: cost so far (actual path cost).
        # current: current city.
        # visited: current visited array.
        # path: sequence of visited vertices in order.
        open_list: List[Tuple[int, int, int, List[int], List[int]]] = []
        heapq.heappush(open_list, (initial_h, 0, start, visited_start, [start]))

        # Keeps the best known g value for each (current, visited) combination:
        best_g: Dict[Tuple[int, Tuple[int, ...]], int] = {
            (start, tuple(visited_start)): 0
        }

        # Main A*, while we have choices to make
        while open_list:
            # Get the best choice for now
            f, g, current, visited, path = heapq.heappop(open_list)

            # If we have visited all nodes
            if all(x == 1 for x in visited):
                # If there is no edge from the last node to the start node
                # We skip this path
                if (current, start) not in self.graph.weight:
                    continue
                
                # Otherwise we found our solution
                total_cost = g + self.graph.weight[(current, start)]
                return path, total_cost

            # Start searching for the next node
            for v in range(1, n + 1):
                # if it was already visited skip it
                if visited[v - 1] == 1:
                    continue
                
                # if there is no edge from current to v skip it
                if (current, v) not in self.graph.weight:
                    continue

                # Compute new path cost if we move to v
                edge_cost = self.graph.weight[(current, v)]
                g_new = g + edge_cost

                # Create a copy of visited array, mark v as visited and save the copy to the state key
                # I do this to avoid modifying the original visited array
                new_visited = list(visited)
                new_visited[v - 1] = 1
                state_key = (v, tuple(new_visited))

                # If we have already visited this node and the new path cost is higher, skip it
                # because it's not a good solution
                if state_key in best_g and g_new >= best_g[state_key]:
                    continue

                # otherwise if g_new < best_g[state_key], so we update the best g value for this state
                best_g[state_key] = g_new

                # heuristic evaluation
                h = self.heuristic.evaluate(new_visited, v)
                f_new = g_new + h
                heapq.heappush(open_list, (f_new, g_new, v, new_visited, path + [v]))

        raise ValueError("No Hamiltonian cycle found")
