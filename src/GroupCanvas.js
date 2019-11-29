import React, { useState, useRef, useEffect } from "react";

export default function GroupCanvas(props) {
  const canvas = useRef();

  const subtract = ([x1, y1], [x2, y2]) => {
    return [-x2 + x1, -y2 + y1];
  };

  const crossCalc = ([x1, y1], [x2, y2]) => {
    return x1 * y2 - y1 * x2;
  };

  useEffect(() => {
    const ctx = canvas.current.getContext("2d");

    const { nodes } = props; // S
    if (props.nodes && props.nodes.length > 2) {
      nodes.sort((a, b) => a.x - b.x);

      const hull = [];

      let leftMost;
      let currentVertex;
      let index;
      let nextIndex = -1;
      let nextVertex;

      leftMost = nodes[0];
      currentVertex = leftMost;
      hull.push(currentVertex);
      nextVertex = nodes[1];
      index = 2;
      let isRunning = true;
      while (isRunning) {
        const checking = nodes[index];
        const a = subtract(
          [nextVertex.x, nextVertex.y],
          [currentVertex.x, currentVertex.y]
        );
        const b = subtract(
          [checking.x, checking.y],
          [currentVertex.x, currentVertex.y]
        );
        const cross = crossCalc(a, b);

        if (cross < 0) {
          nextVertex = checking;
          nextIndex = index;
        }

        index += 1;
        if (index == nodes.length) {
          if (nextVertex == leftMost) {
            isRunning = false;
          } else {
            hull.push(nextVertex);
            currentVertex = nextVertex;
            index = 0;
            // points.splice(nextIndex, 1);
            nextVertex = leftMost;
          }
        }
      }

      ctx.fillStyle = hull[0].color;
      //   ctx.fillRect(0, 0, 100, 1000);
      ctx.beginPath();
      ctx.moveTo(
        hull[0][`renderer${props.renderer.current}:x`],
        hull[0][`renderer${props.renderer.current}:y`]
      );
      console.log(nodes[0]);

      for (let i = 1; i < hull.length; i++) {
        const element = hull[i];
        ctx.lineTo(
          element[`renderer${props.renderer.current}:x`],
          element[`renderer${props.renderer.current}:y`]
        );

        //      ctx.fillRect(element["renderer1:x"], element["renderer1:y"], 100, 100);
      }
      ctx.closePath();
      ctx.fill();
    }
  });

  // 2
  /* 
read_cam0:size: 10
read_cam0:x: -167.29192015426383
read_cam0:y: 33.92495315602701
renderer1:size: 10
renderer1:x: 356.70807984573617
renderer1:y: 425.924953156027
size: 10
x: -225.27732849121094
y: 23.203983306884766
*/

  /*
read_cam0:size: 10
read_cam0:x: -167.29192015426383
read_cam0:y: 33.92495315602701
renderer5:size: 10
renderer5:x: 372.70807984573617
renderer5:y: 587.924953156027
size: 10
x: -225.27732849121094
y: 23.203983306884766
  */
  return (
    <div
      style={{
        zIndex: -1,
        position: "absolute",
        opacity: "0.45",
        width: "70vw",
        height: "100vh",
        top: 0
      }}
    >
      <canvas
        id="areaCanvas"
        ref={canvas}
        style={{ zIndex: -2 }}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
}
