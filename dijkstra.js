function dijkstra(graph, start) {
  const costs = {};
  const visited = {};

  for (let city in graph) {
    costs[city] = Infinity;
  }
  costs[start] = 0;

  while (true) {
    let cheapestCity = null;
    for (let city in costs) {
      if (!visited[city]) {
        if (cheapestCity === null || costs[city] < costs[cheapestCity]) {
          cheapestCity = city;
        }
      }
    }

    if (cheapestCity === null) break;

    for (let neighbor of graph[cheapestCity]) {
      let newCost = costs[cheapestCity] + neighbor.cost;
      if (newCost < costs[neighbor.to]) {
        costs[neighbor.to] = newCost;
      }
    }

    visited[cheapestCity] = true;
  }

  return costs;
}

const graph = {
  Delhi: [{ to: "Mumbai", cost: 500 }, { to: "Bangalore", cost: 800 }],
  Mumbai: [{ to: "Chennai", cost: 300 }],
  Bangalore: [{ to: "Chennai", cost: 200 }],
  Chennai: []
};

console.log(dijkstra(graph, "Delhi"));
