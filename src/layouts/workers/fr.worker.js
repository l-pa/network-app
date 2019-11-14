let running = true;
let iterCount = 100;

let objectNodes = {};

const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj;
  }, {});

function atomicGo(nodes, edges, config) {
  if (!running || iterCount < 1) return false;

  var i,
    j,
    n,
    n2,
    e,
    xDist,
    yDist,
    dist,
    repulsiveF,
    nodesCount = nodes.length,
    edgesCount = edges.length;

  config.area = config.autoArea ? nodesCount * nodesCount : config.area;
  iterCount--;
  running = iterCount > 0;

  var maxDisplace = Math.sqrt(config.area) / 10,
    k = Math.sqrt(config.area / (1 + nodesCount));

  for (i = 0; i < nodesCount; i++) {
    n = nodes[i];

    // Init
    if (!n.fr) {
      n.fr_x = n.x;
      n.fr_y = n.y;
      n.fr = {
        dx: 0,
        dy: 0
      };
    }

    for (j = 0; j < nodesCount; j++) {
      n2 = nodes[j];

      // Repulsion force
      if (n.id != n2.id) {
        xDist = n.fr_x - n2.fr_x;
        yDist = n.fr_y - n2.fr_y;
        dist = Math.sqrt(xDist * xDist + yDist * yDist) + 0.01;
        // var dist = Math.sqrt(xDist * xDist + yDist * yDist) - n1.size - n2.size;

        if (dist > 0) {
          repulsiveF = (k * k) / dist;
          n.fr.dx += (xDist / dist) * repulsiveF;
          n.fr.dy += (yDist / dist) * repulsiveF;
        }
      }
    }
  }

  var nSource, nTarget, attractiveF;

  for (i = 0; i < edgesCount; i++) {
    e = edges[i];

    // Attraction force
    nSource = objectNodes[e.source];
    nTarget = objectNodes[e.target];

    xDist = nSource.fr_x - nTarget.fr_x;
    yDist = nSource.fr_y - nTarget.fr_y;
    dist = Math.sqrt(xDist * xDist + yDist * yDist) + 0.01;
    // dist = Math.sqrt(xDist * xDist + yDist * yDist) - nSource.size - nTarget.size;
    attractiveF = (dist * dist) / k;

    if (dist > 0) {
      nSource.fr.dx -= (xDist / dist) * attractiveF;
      nSource.fr.dy -= (yDist / dist) * attractiveF;
      nTarget.fr.dx += (xDist / dist) * attractiveF;
      nTarget.fr.dy += (yDist / dist) * attractiveF;
    }
  }

  var d, gf, limitedDist;

  for (i = 0; i < nodesCount; i++) {
    n = nodes[i];

    // Gravity
    d = Math.sqrt(n.fr_x * n.fr_x + n.fr_y * n.fr_y);
    gf = 0.01 * k * config.gravity * d;
    n.fr.dx -= (gf * n.fr_x) / d;
    n.fr.dy -= (gf * n.fr_y) / d;

    // Speed
    n.fr.dx *= config.speed;
    n.fr.dy *= config.speed;

    // Apply computed displacement
    if (!n.fixed) {
      xDist = n.fr.dx;
      yDist = n.fr.dy;
      dist = Math.sqrt(xDist * xDist + yDist * yDist);

      if (dist > 0) {
        limitedDist = Math.min(maxDisplace * config.speed, dist);
        n.fr_x += (xDist / dist) * limitedDist;
        n.fr_y += (yDist / dist) * limitedDist;
      }
    }
  }
  var tmp = [];
  nodes.forEach(element => {
    tmp.push({ fr_x: element.fr_x, fr_y: element.fr_y });
  });
  postMessage({ nodes: tmp, iterCount });
}

addEventListener("message", event => {
  if (event.data.run === true) {
    iterCount = event.data.config.iterations;
    objectNodes = arrayToObject(event.data.nodes, "id");
    while (running) {
      atomicGo(event.data.nodes, event.data.edges, event.data.config);
    }
    //  postMessage({ status: "Worker stopped" });
  }

  if (event.data.run === false) {
    //   postMessage({ status: "Worker stopped" });
  }
});
