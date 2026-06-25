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
 
  const newGraph = { ...graph };
  newGraph["Source"] = [];
  for (let city in graph) {
    newGraph["Source"].push({ to: city, cost: 0 });
  }

  
  const heights = bellmanFord(newGraph, "Source");

 
  const adjustedGraph = {};
  for (let city in graph) {
    adjustedGraph[city] = [];
    for (let neighbor of graph[city]) {
      let newCost = neighbor.cost + heights[city] - heights[neighbor.to];
      adjustedGraph[city].push({ to: neighbor.to, cost: newCost });
    }
  }

  
  const allPairs = {};
  for (let city in graph) {
    const result = dijkstra(adjustedGraph, city);

    
    allPairs[city] = {};
    for (let destination in result) {
      allPairs[city][destination] =
        result[destination] - heights[city] + heights[destination];
    }
  }

  return allPairs;
}


const graph = {
  Delhi: [{ to: "Mumbai", cost: 500 }, { to: "Bangalore", cost: 800 }],
  Mumbai: [{ to: "Chennai", cost: 300 }],
  Bangalore: [{ to: "Chennai", cost: 200 }],
  Chennai: [{ to: "Mumbai", cost: -100 }],
};

const result = johnsons(graph);
console.log("Cheapest routes between every pair of cities:");
console.log(result);
// Timing code
const startTime = Date.now();

const bigGraph = {};
const cities = ["A","B","C","D","E","F","G","H","I","J",
                "K","L","M","N","O","P","Q","R","S","T"];

// Add all cities
for(let city of cities){
  bigGraph[city] = [];
}

// Add random flights between cities
for(let i = 0; i < cities.length; i++){
  for(let j = 0; j < cities.length; j++){
    if(i !== j && Math.random() > 0.5){
      bigGraph[cities[i]].push({
        to: cities[j],
        cost: Math.floor(Math.random() * 1000) + 1
      });
    }
  }
}

const bigResult = johnsons(bigGraph);
const endTime = Date.now();

console.log("Total cities:", cities.length);
console.log("Time taken:", endTime - startTime, "milliseconds");