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
  return costs;
}

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

function johnsons(graph) {
  // Step 1: Add imaginary Source city
  const newGraph = { ...graph };
  newGraph["Source"] = [];
  for (let city in graph) {
    newGraph["Source"].push({ to: city, cost: 0 });
  }

  // Step 2: Run Bellman-Ford from Source to get heights
  const heights = bellmanFord(newGraph, "Source");

  // Step 3: Adjust all edge costs using heights
  const adjustedGraph = {};
  for (let city in graph) {
    adjustedGraph[city] = [];
    for (let neighbor of graph[city]) {
      let newCost = neighbor.cost + heights[city] - heights[neighbor.to];
      adjustedGraph[city].push({ to: neighbor.to, cost: newCost });
    }
  }

  // Step 4: Run Dijkstra from every city
  const allPairs = {};
  for (let city in graph) {
    const result = dijkstra(adjustedGraph, city);

    // Step 5: Convert costs back to original values
    allPairs[city] = {};
    for (let destination in result) {
      allPairs[city][destination] =
        result[destination] - heights[city] + heights[destination];
    }
  }

  return allPairs;
}

// Your graph
const graph = {
  Delhi: [{ to: "Mumbai", cost: 500 }, { to: "Bangalore", cost: 800 }],
  Mumbai: [{ to: "Chennai", cost: 300 }],
  Bangalore: [{ to: "Chennai", cost: 200 }],
  Chennai: [{ to: "Mumbai", cost: -100 }],
};

const result = johnsons(graph);
console.log("Cheapest routes between every pair of cities:");
console.log(result);