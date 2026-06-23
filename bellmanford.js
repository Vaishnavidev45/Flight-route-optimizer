function bellmanFord(graph, start) {
  const costs = {};

  for (let city in graph) {
    costs[city] = Infinity;
  }
  costs[start] = 0;

  for (let i = 0; i < Object.keys(graph).length - 1; i++) {
    for (let city in graph) {
      for (let neighbor of graph[city]) {
        let newCost = costs[city] + neighbor.cost;
        if (newCost < costs[neighbor.to]) {
          costs[neighbor.to] = newCost;
        }
      }
    }
  }

  let hasNegativeCycle = false;
  for (let city in graph) {
    for (let neighbor of graph[city]) {
      if (costs[city] + neighbor.cost < costs[neighbor.to]) {
        hasNegativeCycle = true;
      }
    }
  }

  console.log("Has negative cycle:", hasNegativeCycle);
  return costs;
}

const graph = {
  Delhi: [{ to: "Mumbai", cost: 500 }, { to: "Bangalore", cost: 800 }],
  Mumbai: [{ to: "Chennai", cost: 300 }],
  Bangalore: [{ to: "Chennai", cost: 200 }],
  Chennai: [{ to: "Mumbai", cost: -100 }]
};

console.log(bellmanFord(graph, "Delhi"));