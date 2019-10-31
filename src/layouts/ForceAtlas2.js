import React, { useState, useRef, useEffect } from "react";

function ForceAtlas2(props) {
  const linLogMode = useRef(false);
  const scalingRatio = useRef(1);
  const gravity = useRef(1);
  const worker = useRef(false);

  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="layoutSettings settings">
      <p>Options</p>
      <br />
      <div>
        <input ref={linLogMode} type="checkbox" value="linLogMode" />
        linLogMode
      </div>
      <div>
        <input
          step={0.1}
          min={0.1}
          max={10}
          defaultValue={scalingRatio.current}
          onChange={event => {
            scalingRatio.current = event.target.value;
          }}
          type="number"
        />
        scalingRatio
      </div>
      <div>
        <input
          step={0.1}
          min={0.1}
          max={50}
          defaultValue={gravity.current}
          onChange={event => {
            gravity.current = event.target.value;
          }}
          type="number"
        />
        gravity
      </div>
      <div>
        <input ref={worker} type="checkbox" value="worker" />
        worker
      </div>
      <button
        type="button"
        onClick={event => {
          const settings = {
            linLogMode: linLogMode.current.checked,
            scalingRatio: scalingRatio.current,
            gravity: gravity.current,
            worker: worker.current.checked
          };
          if (window.network) {
            if (!isRunning) {
              window.network.startForceAtlas2(settings);
            } else {
              window.network.configForceAtlas2(settings);
            }
            setIsRunning(true);
          }
        }}
      >
        Start
      </button>
      <button
        type="button"
        onClick={event => {
          window.network.killForceAtlas2();
          setIsRunning(false);
        }}
      >
        Stop
      </button>
    </div>
  );
}

export { ForceAtlas2 };
