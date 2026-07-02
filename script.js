const graph = {
  Delhi:     [{ to: "Mumbai", cost: 500 },
              { to: "Bangalore", cost: 800 }],
  Mumbai:    [{ to: "Chennai", cost: 300 }],
  Bangalore: [{ to: "Chennai", cost: 200 }],
  Chennai:   [{ to: "Mumbai", cost: -100 }],
};

const positions = {
  Delhi:     { x: 200, y: 100 },
  Mumbai:    { x: 100, y: 350 },
  Bangalore: { x: 420, y: 380 },
  Chennai:   { x: 650, y: 220 },
};

const cityColors = {
  Delhi:     "#ff6b6b",
  Mumbai:    "#4ecdc4",
  Bangalore: "#45b7d1",
  Chennai:   "#96ceb4",
};

function bellmanFord(graph, start) {
  const costs = {};
  for (let city in graph) costs[city] = Infinity;
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
  for (let city in graph) costs[city] = Infinity;
  costs[start] = 0;
  while (true) {
    let cheapestCity = null;
    for (let city in costs) {
      if (!visited[city]) {
        if (cheapestCity === null ||
            costs[city] < costs[cheapestCity]) {
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
      let newCost = neighbor.cost +
                    heights[city] - heights[neighbor.to];
      adjustedGraph[city].push({
        to: neighbor.to, cost: newCost
      });
    }
  }
  const allPairs = {};
  for (let city in graph) {
    const result = dijkstra(adjustedGraph, city);
    allPairs[city] = {};
    for (let dest in result) {
      allPairs[city][dest] =
        result[dest] - heights[city] + heights[dest];
    }
  }
  return allPairs;
}

const allPairs = johnsons(graph);
const cities = Object.keys(graph);
const svg = document.getElementById("graph-svg");

// Draw flight lines
for (let city in graph) {
  for (let neighbor of graph[city]) {
    const from = positions[city];
    const to = positions[neighbor.to];

    // Draw curved line
    const path = document.createElementNS(
      "http://www.w3.org/2000/svg", "path"
    );
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2 - 40;
    const d = `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
    path.setAttribute("d", d);
    path.setAttribute("stroke", "#cccccc");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-dasharray", "6,4");
    path.id = `line-${city}-${neighbor.to}`;
    svg.appendChild(path);

    // Cost label
    const text = document.createElementNS(
      "http://www.w3.org/2000/svg", "text"
    );
    text.setAttribute("x", mx);
    text.setAttribute("y", my - 6);
    text.setAttribute("fill", "#888");
    text.setAttribute("font-size", "12");
    text.setAttribute("font-weight", "bold");
    text.setAttribute("text-anchor", "middle");
    text.textContent = `₹${neighbor.cost}`;
    svg.appendChild(text);
  }
}

// Draw city circles
for (let city in positions) {
  const pos = positions[city];
  const g = document.createElementNS(
    "http://www.w3.org/2000/svg", "g"
  );
  g.classList.add("city-circle");
  g.id = `city-${city}`;
  g.addEventListener("click", () => onCityClick(city));

  // Shadow circle
  const shadow = document.createElementNS(
    "http://www.w3.org/2000/svg", "circle"
  );
  shadow.setAttribute("cx", pos.x + 3);
  shadow.setAttribute("cy", pos.y + 3);
  shadow.setAttribute("r", 35);
  shadow.setAttribute("fill", "rgba(0,0,0,0.15)");
  g.appendChild(shadow);

  // Main circle
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg", "circle"
  );
  circle.setAttribute("cx", pos.x);
  circle.setAttribute("cy", pos.y);
  circle.setAttribute("r", 35);
  circle.setAttribute("fill", cityColors[city]);
  circle.setAttribute("stroke", "white");
  circle.setAttribute("stroke-width", "3");
  g.appendChild(circle);

  // Plane emoji
  const emoji = document.createElementNS(
    "http://www.w3.org/2000/svg", "text"
  );
  emoji.setAttribute("x", pos.x);
  emoji.setAttribute("y", pos.y - 6);
  emoji.setAttribute("text-anchor", "middle");
  emoji.setAttribute("font-size", "16");
  emoji.textContent = "✈️";
  g.appendChild(emoji);

  // City name
  const label = document.createElementNS(
    "http://www.w3.org/2000/svg", "text"
  );
  label.setAttribute("x", pos.x);
  label.setAttribute("y", pos.y + 12);
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("fill", "white");
  label.setAttribute("font-size", "11");
  label.setAttribute("font-weight", "bold");
  label.textContent = city;
  g.appendChild(label);

  svg.appendChild(g);
}

let selectedCity = null;
const infoBox = document.getElementById("info-box");
const resultBox = document.getElementById("result-box");

function resetLines() {
  for (let city in graph) {
    for (let neighbor of graph[city]) {
      const line = document.getElementById(
        `line-${city}-${neighbor.to}`
      );
      if (line) {
        line.setAttribute("stroke", "#cccccc");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("stroke-dasharray", "6,4");
      }
    }
  }
}

function resetCities() {
  for (let city in positions) {
    const circle = document.querySelector(
      `#city-${city} circle:nth-child(2)`
    );
    if (circle) {
      circle.setAttribute("fill", cityColors[city]);
      circle.setAttribute("r", 35);
    }
    const g = document.getElementById(`city-${city}`);
    if (g) g.classList.remove("pulse");
  }
}

function onCityClick(city) {
  if (!selectedCity) {
    selectedCity = city;

    // Animate selected city
    const circle = document.querySelector(
      `#city-${city} circle:nth-child(2)`
    );
    circle.setAttribute("fill", "#ff9800");
    circle.setAttribute("r", 40);
    const g = document.getElementById(`city-${city}`);
    g.classList.add("pulse");

    infoBox.textContent =
      `✈️ From: ${city} — Now click your destination city!`;
    resultBox.style.display = "none";

  } else {
    if (selectedCity === city) {
      selectedCity = null;
      resetCities();
      infoBox.textContent =
        "🗺️ Click a city to select it as START";
      return;
    }

    const cost = allPairs[selectedCity][city];
    resultBox.style.display = "block";

    if (cost === Infinity) {
      resultBox.textContent =
        `❌ No route from ${selectedCity} to ${city}`;
      resultBox.style.color = "#e53935";
    } else {
      resultBox.textContent =
        `🎉 Cheapest: ${selectedCity} → ${city} = ₹${cost}`;
      resultBox.style.color = "#2e7d32";

      // Highlight route line
      const line = document.getElementById(
        `line-${selectedCity}-${city}`
      );
      if (line) {
        resetLines();
        line.setAttribute("stroke", "#ff6b35");
        line.setAttribute("stroke-width", "4");
        line.setAttribute("stroke-dasharray", "none");
      }
    }

    selectedCity = null;
    resetCities();
    infoBox.textContent =
      "🗺️ Click a city to select it as START";
  }
}

// Build results table
const thead = document.querySelector("#result-table thead");
const tbody = document.querySelector("#result-table tbody");
let headerRow = "<tr><th>From / To</th>";
for (let city of cities) headerRow += `<th>✈️ ${city}</th>`;
headerRow += "</tr>";
thead.innerHTML = headerRow;

for (let from of cities) {
  let row = `<td><strong>${from}</strong></td>`;
  for (let to of cities) {
    const cost = allPairs[from][to];
    if (from === to) {
      row += `<td>—</td>`;
    } else if (cost === Infinity) {
      row += `<td class="no-route">✗</td>`;
    } else {
      row += `<td class="has-route">₹${cost}</td>`;
    }
  }
  tbody.innerHTML += `<tr>${row}</tr>`;
}