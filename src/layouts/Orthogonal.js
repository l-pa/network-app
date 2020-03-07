/* eslint-disable */

import React, { useState, useRef, useEffect } from "react";

import {
  SettingsButton,
  SettingsInput,
  SettingsSubTitle,
  SettingsSelect,
  HorizontalLine,
  SettingsTitle,
  SettingsSubMenu,
  SideBar,
  Test,
  SettingsInputCheckbox,
  Input
} from "../style";

import Worker from "worker-loader!./workers/orthogonal.worker.js";

let helloWorker = new Worker();

export default function Orthogonal(props) {
  const margin = useRef(1);

  const [isRunning, setIsRunning] = useState(false);

  const init = (sigInst) => {
    // helloWorker = new Worker();

    // helloWorker.postMessage({
    //   run: true,
    //   nodes: sigInst.graph.nodes(),
    //   edges: sigInst.graph.edges(),
    //   config: {iterations: 1}
    // });

    //   helloWorker.onmessage = event => {
    //     console.log(event.data);
    //     if (event.data.nodes){
    //     const instanceNodes = sigInst.graph.nodes();

    //     // Apply changes
    //     for (let i = 0; i < event.data.nodes.length; i++) {
    //       instanceNodes[i].x = event.data.nodes[i].x;
    //       instanceNodes[i].y = event.data.nodes[i].y;
    //     }

    //     if (event.data.iterCount === 0) {
    //       setIsRunning(false);
    //     }
    //     sigInst.refresh();
    //   };
    // }
    //  this.stop();

    let x = 0
    let y = 0
    
    let x_p = 10
    let y_p = 10    

    let compactionDir = true;
    let iterationCount= 90 * Math.ceil(Math.sqrt(sigInst.graph.nodes().length))

    let T = 2 * Math.sqrt(sigInst.graph.nodes().length)

    let k = (0.2 / T)**(1/iterationCount)

    for (let i = 0; i < sigInst.graph.nodes().length; i++) {

      sigInst.graph.nodes()[i].x = x
      sigInst.graph.nodes()[i].y = y

      if (i == 0) {
        continue
      }
      console.log(Math.ceil((5 * Math.sqrt(sigInst.graph.nodes().length))));
      
      x += x_p
      if (i % Math.ceil((5 * Math.sqrt(sigInst.graph.nodes().length))) === 0) {
        y += y_p
        x = 0
      }
    }
    sigInst.refresh()
    setIsRunning(false)
  }

  useEffect(() => {
    return function unmount() {
      helloWorker.terminate();
    };
  }, []);

  return (
    <SettingsSubMenu>
      <Input>
        Margin
      <SettingsInput
          step={0.1}
          min={0.1}
          max={20}
          defaultValue={margin.current}
          onChange={event => {
            margin.current = event.target.value;
          }}
          type="number"
        />
      </Input>
      {!isRunning ? (
        <SettingsButton
          type="button"
          onClick={event => {
            if (window.network) {
              setIsRunning(true);
              init(window.network)
            }
          }}
        >
          Start
        </SettingsButton>
      ) : (
          <SettingsButton
            type="button"
            onClick={event => {
              helloWorker.terminate();
              setIsRunning(false);
            }}
          >
            Stop
        </SettingsButton>
        )}
    </SettingsSubMenu>
  );
}
