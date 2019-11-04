import React, { useState, useRef, useEffect } from "react";

function FruchtermanReingold(props) {
  const autoArea = useRef(false);
  const area = useRef(1);
  const gravity = useRef(1);
  const speed = useRef(0.5);
  const iterations = useRef(100);

  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="layoutSettings settings">
      <p>Options</p>
      <br />
      <div>
        <input ref={autoArea} type="checkbox" value="linLogMode" />
        autoArea
      </div>
      <div>
        <input
          step={0.1}
          min={0.1}
          max={20}
          defaultValue={area.current}
          onChange={event => {
            area.current = event.target.value;
          }}
          type="number"
        />
        area
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
        <input
          step={0.1}
          min={0.1}
          max={50}
          defaultValue={speed.current}
          onChange={event => {
            speed.current = event.target.value;
          }}
          type="number"
        />
        speed
      </div>
      <div>
        <input
          step={1}
          min={1}
          max={10000}
          defaultValue={iterations.current}
          onChange={event => {
            iterations.current = event.target.value;
          }}
          type="number"
        />
        iterations
      </div>
      <button
        type="button"
        onClick={event => {
          const settings = {
            easing: "quadraticIn",
            autoArea: autoArea.current.checked,
            area: area.current,
            gravity: gravity.current,
            speed: speed.current,
            iterations: iterations.current
          };
          if (window.network) {
            // Start the algorithm:
            window.sigma.layouts.fruchtermanReingold.configure(
              window.network,
              settings
            );
            // Bind all events:

            window.sigma.layouts.fruchtermanReingold.start(window.network);
          }
        }}
      >
        Start
      </button>
    </div>
  );
}

export { FruchtermanReingold };
