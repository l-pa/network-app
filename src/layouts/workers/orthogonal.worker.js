/* eslint-disable */

let running = true;
let iterCount = 100;
let objectNodes = {};
let x = 0
let y = 0

let x_p = 10
let y_p = 10


const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj;
  }, {});

function atomicGo(nodes, edges, config) {
  if (!running || iterCount < 1) return false;

  // define variables

  iterCount--;
  running = iterCount > 0;



  for (i = 0; i < nodes.length; i++) {
  
    nodes[i].x = x
    nodes[i].y = y
    
    var tmp = [];
    nodes.forEach(element => {
      tmp.push({ x: element.x, y: element.y });
    });
    
    if (i == 0) {        
      continue
    }
    x += x_p
    if (i % 5 === 0) {
      y += y_p
      x = 0
    }
    postMessage({ nodes: tmp, iterCount });
  }
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