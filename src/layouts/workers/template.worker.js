/* eslint-disable */

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
