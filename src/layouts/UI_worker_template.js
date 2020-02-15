/* eslint-disable */

import React, { useState, useRef, useEffect } from "react";

import Worker from "worker-loader!./workers/template.worker.js";

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

let helloWorker = new Worker();

export default function Template(props) {
  const option = useRef(1);

  const [isRunning, setIsRunning] = useState(false);

  const init = (sigInst) => {
    helloWorker = new Worker();

    helloWorker.postMessage({
      run: true,
      nodes: sigInst.graph.nodes(),
      edges: sigInst.graph.edges(),
      config: {iterations: 100}
    });

    helloWorker.onmessage = event => {
      console.log(event.data);
      if (event.data.nodes){
      const instanceNodes = sigInst.graph.nodes();

      // Apply changes
      for (let i = 0; i < event.data.nodes.length; i++) {
        instanceNodes[i].x = event.data.nodes[i].fr_x;
        instanceNodes[i].y = event.data.nodes[i].fr_y;
      }
      
      if (event.data.iterCount === 0) {
        setIsRunning(false);
      }
      this.sigInst.refresh();
    };
  }
    //  this.stop();
  }

  useEffect(() => {
    return function unmount() {
      helloWorker.terminate();
    };
  }, []);

  return (
    <SettingsSubMenu>
    <Input>
      Option
      <SettingsInput
        step={0.1}
        min={0.1}
        max={20}
        defaultValue={option.current}
        onChange={event => {
          option.current = event.target.value;
        }}
        type="number"
        />
        </Input>
      {!isRunning ? (
        <SettingsButton
          type="button"
          onClick={event => {
            const settings = {
              option: option.current
            };

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
