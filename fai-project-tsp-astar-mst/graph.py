from typing import List, Tuple, Dict

# The graph that needs to be walked by the salesman
class Graph:
    def __init__(self, n: int,
                 edges: List[Tuple[int, int, int]],
                 weight: Dict[Tuple[int, int], int]) -> None:
        self.n = n
        self.edges = edges
        self.weight = weight

# Read the graph from a file and initialize the graph object
def graph_from_file(path: str):
    with open(path, "r", encoding="utf-8") as f:
        first_line = f.readline().strip()
        while first_line == "":
            first_line = f.readline().strip()
        parts = first_line.split()
        if len(parts) != 2:
            raise ValueError("First line of graph.txt must be: n m")
        n = int(parts[0])
        m = int(parts[1])
        edges: List[Tuple[int, int, int]] = []
        weight: Dict[Tuple[int, int], int] = {}
        for _ in range(m):
            line = f.readline()
            if not line:
                break
            line = line.strip()
            if not line:
                continue
            u_str, v_str, w_str = line.split()
            u = int(u_str)
            v = int(v_str)
            w = int(w_str)
            if u == v:
                continue
            edges.append((u, v, w))
            weight[(u, v)] = w
            weight[(v, u)] = w

    # if we got weights, max_w is the maximum weight from our input. Otherwise, max_w is 1
    if weight:
        max_w = max(weight.values())
    else:
        max_w = 1

    # fill missing edges with very large weights. With that we keep them connected but improbable 
    # I chose 1000 times the maximum existing weight for the missing edges
    very_large = max_w * 1000
    for i in range(1, n + 1):
        for j in range(i + 1, n + 1):
            if (i, j) not in weight:
                weight[(i, j)] = very_large
                weight[(j, i)] = very_large
                edges.append((i, j, very_large))
    
    # return the graph
    return Graph(n, edges, weight)