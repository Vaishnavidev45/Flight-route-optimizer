const graph = {};

function addCity(city) {
  graph[city] = [];
}

function addFlight(from, to, cost) {
  graph[from].push({ to: to, cost: cost });
}

addCity("Delhi");
addCity("Mumbai");
addCity("Bangalore");
addCity("Chennai");

addFlight("Delhi", "Mumbai", 500);
addFlight("Delhi", "Bangalore", 800);
addFlight("Mumbai", "Chennai", 300);
addFlight("Bangalore", "Chennai", 200);

console.log(graph);