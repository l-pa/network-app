let running = true;
let iterCount = 100;

function atomicGo(nodes, config) {
  if (!running || iterCount < 1) return false;

  const nodesCount = nodes.length;
  let i;
  let n;
  let n1;
  let n2;
  let xmin = Infinity;
  let xmax = -Infinity;
  let ymin = Infinity;
  let ymax = -Infinity;
  let xwidth;
  let yheight;
  let xcenter;
  let ycenter;
  let grid;
  let row;
  let col;
  let minXBox;
  let maxXBox;
  let minYBox;
  let maxYBox;
  let adjacentNodes;
  let subRow;
  let subCol;
  let nxmin;
  let nxmax;
  let nymin;
  let nymax;

  iterCount--;
  running = false;

  for (i = 0; i < nodesCount; i++) {
    n = nodes[i];
    n.dn.dx = 0;
    n.dn.dy = 0;

    // Find the min and max for both x and y across all nodes
    xmin = Math.min(
      xmin,
      n.dn_x - (n.dn_size * config.scaleNodes + config.nodeMargin)
    );
    xmax = Math.max(
      xmax,
      n.dn_x + (n.dn_size * config.scaleNodes + config.nodeMargin)
    );
    ymin = Math.min(
      ymin,
      n.dn_y - (n.dn_size * config.scaleNodes + config.nodeMargin)
    );
    ymax = Math.max(
      ymax,
      n.dn_y + (n.dn_size * config.scaleNodes + config.nodeMargin)
    );
  }

  xwidth = xmax - xmin;
  yheight = ymax - ymin;
  xcenter = (xmin + xmax) / 2;
  ycenter = (ymin + ymax) / 2;
  xmin = xcenter - (config.permittedExpansion * xwidth) / 2;
  xmax = xcenter + (config.permittedExpansion * xwidth) / 2;
  ymin = ycenter - (config.permittedExpansion * yheight) / 2;
  ymax = ycenter + (config.permittedExpansion * yheight) / 2;

  grid = {}; // An object of objects where grid[row][col] is an array of node ids representing nodes that fall in that grid. Nodes can fall in more than one grid

  for (row = 0; row < config.gridSize; row++) {
    grid[row] = {};
    for (col = 0; col < config.gridSize; col++) {
      grid[row][col] = [];
    }
  }

  // Place nodes in grid
  for (i = 0; i < nodesCount; i++) {
    n = nodes[i];

    nxmin = n.dn_x - (n.dn_size * config.scaleNodes + config.nodeMargin);
    nxmax = n.dn_x + (n.dn_size * config.scaleNodes + config.nodeMargin);
    nymin = n.dn_y - (n.dn_size * config.scaleNodes + config.nodeMargin);
    nymax = n.dn_y + (n.dn_size * config.scaleNodes + config.nodeMargin);

    minXBox = Math.floor((config.gridSize * (nxmin - xmin)) / (xmax - xmin));
    maxXBox = Math.floor((config.gridSize * (nxmax - xmin)) / (xmax - xmin));
    minYBox = Math.floor((config.gridSize * (nymin - ymin)) / (ymax - ymin));
    maxYBox = Math.floor((config.gridSize * (nymax - ymin)) / (ymax - ymin));
    for (col = minXBox; col <= maxXBox; col++) {
      for (row = minYBox; row <= maxYBox; row++) {
        grid[row][col].push(n.id);
      }
    }
  }

  adjacentNodes = {}; // An object that stores the node ids of adjacent nodes (either in same grid box or adjacent grid box) for all nodes

  for (row = 0; row < config.gridSize; row++) {
    for (col = 0; col < config.gridSize; col++) {
      grid[row][col].forEach(function(nodeId) {
        if (!adjacentNodes[nodeId]) {
          adjacentNodes[nodeId] = [];
        }
        for (
          subRow = Math.max(0, row - 1);
          subRow <= Math.min(row + 1, config.gridSize - 1);
          subRow++
        ) {
          for (
            subCol = Math.max(0, col - 1);
            subCol <= Math.min(col + 1, config.gridSize - 1);
            subCol++
          ) {
            grid[subRow][subCol].forEach(function(subNodeId) {
              if (
                subNodeId !== nodeId &&
                adjacentNodes[nodeId].indexOf(subNodeId) === -1
              ) {
                adjacentNodes[nodeId].push(subNodeId);
              }
            });
          }
        }
      });
    }
  }

  // If two nodes overlap then repulse them
  for (i = 0; i < nodesCount; i++) {
    n1 = nodes[i];
    adjacentNodes[n1.id].forEach(function(nodeId) {
      let n2 = {};
      nodes.forEach(element => {
        if (element.id === nodeId) {
          n2 = element;
        }
      });
      const xDist = n2.dn_x - n1.dn_x;
      const yDist = n2.dn_y - n1.dn_y;
      const dist = Math.sqrt(xDist * xDist + yDist * yDist);
      const collision =
        dist <
        n1.dn_size * config.scaleNodes +
          config.nodeMargin +
          (n2.dn_size * config.scaleNodes + config.nodeMargin);
      if (collision) {
        running = true;
        if (dist > 0) {
          n2.dn.dx += (xDist / dist) * (1 + n1.dn_size);
          n2.dn.dy += (yDist / dist) * (1 + n1.dn_size);
        } else {
          n2.dn.dx += xwidth * 0.01 * (0.5 - Math.random());
          n2.dn.dy += yheight * 0.01 * (0.5 - Math.random());
        }
      }
    });
  }

  for (i = 0; i < nodesCount; i++) {
    n = nodes[i];
    if (!n.fixed) {
      n.dn_x += n.dn.dx * 0.1 * config.speed;
      n.dn_y += n.dn.dy * 0.1 * config.speed;
    }
  }

  if (running && iterCount < 1) {
    running = false;
  }
  var tmp = [];
  nodes.forEach(element => {
    tmp.push({ dn_x: element.dn_x, dn_y: element.dn_y });
  });
  postMessage({ nodes: tmp, iterCount, running });
}

addEventListener("message", event => {
  if (event.data.run === true) {
    iterCount = event.data.config.maxIterations;

    while (running) {
      atomicGo(event.data.nodes, event.data.config);
    }
  }

  if (event.data.run === false) {
    //   postMessage({ status: "Worker stopped" });
  }
});
