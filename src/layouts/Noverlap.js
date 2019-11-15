/* eslint-disable */

import React, { useState, useRef, useEffect } from "react";
import Worker from "worker-loader!./workers/noverlap.worker.js";

let helloWorker = new Worker();  

function NoverlapUI(props) {
  const nodeMargin = useRef(5);
  const scaleNodes = useRef(1.2);
  const gridSize = useRef(20);
  const permittedExpansion = useRef(1.1);
  const rendererIndex = useRef(0);
  const speed = useRef(2);
  const maxIterations = useRef(100);
  const [isRunning, setIsRunning] = useState(false);
  
  window.sigma.utils.pkg("sigma.layouts.noverlap");
  
  const settings = {
    speed: 3,
    scaleNodes: 1.2,
    nodeMargin: 5.0,
    gridSize: 20,
    permittedExpansion: 1.1,
    rendererIndex: 0,
    maxIterations: 500
  };
  
  var _instance = {};
  
  /**
   * Event emitter Object
   * ------------------
   */
  var _eventEmitter = {};
  
  function Noverlap() {
    var self = this;
    this.init = function(sigInst, options) {
      options = options || {};
  
      // Properties
      this.sigInst = window.network;
      this.config = window.sigma.utils.extend(options, settings);
      this.easing = options.easing;
      this.duration = options.duration;
  
      if (options.nodes) {
        this.nodes = options.nodes;
        delete options.nodes;
      }
  
      if (
        !window.sigma.plugins ||
        typeof window.sigma.plugins.animate === "undefined"
      ) {
        throw new Error("sigma.plugins.animate is not declared");
      }
  
      // State
      this.running = false;
    };
  
    this.go = function() {
      helloWorker = new Worker();  
      helloWorker.postMessage({
        run: true,
        nodes: this.sigInst.graph.nodes(),
        config: this.config
      });
  
      helloWorker.onmessage = event => {
        console.log(event.data);
        let instanceNodes = this.sigInst.graph.nodes();
        // Apply changes
        for (var i = 0; i < event.data.nodes.length; i++) {
          instanceNodes[i].x = event.data.nodes[i].dn_x;
          instanceNodes[i].y = event.data.nodes[i].dn_y;
        }
  
        if (!event.data.running) {
          let instanceNodes = this.sigInst.graph.nodes();
          for (var i = 0; i < instanceNodes.length; i++) {
            instanceNodes[i].dn = null;
            instanceNodes[i].dn_x = null;
            instanceNodes[i].dn_y = null;
          }
          setIsRunning(false)
        }
        //  this.stop();
        this.sigInst.refresh();
      };
  
    };
  
    this.start = function() {
      var nodes = this.sigInst.graph.nodes();
  
      var prefix = this.sigInst.renderers[self.config.rendererIndex].options
        .prefix;
  
      // Init nodes
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].dn_x = nodes[i][prefix + "x"];
        nodes[i].dn_y = nodes[i][prefix + "y"];
        nodes[i].dn_size = nodes[i][prefix + "size"];
        nodes[i].dn = {
          dx: 0,
          dy: 0
        };
      }
  
      _eventEmitter[self.sigInst.id].dispatchEvent("start");
      this.go();
    };
  
    this.stop = function() {
      var nodes = this.sigInst.graph.nodes();
  
      this.running = false;
  
      if (this.easing) {
        _eventEmitter[self.sigInst.id].dispatchEvent("interpolate");
        window.sigma.plugins.animate(
          self.sigInst,
          {
            x: "dn_x",
            y: "dn_y"
          },
          {
            easing: self.easing,
            onComplete: function() {
              self.sigInst.refresh();
              for (var i = 0; i < nodes.length; i++) {
                nodes[i].dn = null;
                nodes[i].dn_x = null;
                nodes[i].dn_y = null;
              }
              _eventEmitter[self.sigInst.id].dispatchEvent("stop");
            },
            duration: self.duration
          }
        );
      } else {
        // Apply changes
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].x = nodes[i].dn_x;
          nodes[i].y = nodes[i].dn_y;
        }
  
        this.sigInst.refresh();
  
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].dn = null;
          nodes[i].dn_x = null;
          nodes[i].dn_y = null;
        }
        _eventEmitter[self.sigInst.id].dispatchEvent("stop");
      }
    };
  
    this.kill = function() {
      this.sigInst = null;
      this.config = null;
      this.easing = null;
    };
  }
  
  window.sigma.prototype.configNoverlap = function(config) {
    var sigInst = window.network;
  
    if (!config) throw new Error('Missing argument: "config"');
  
    // Create instance if undefined
    if (!_instance[sigInst.id]) {
      _instance[sigInst.id] = new Noverlap();
      _eventEmitter[sigInst.id] = {};
      window.sigma.classes.dispatcher.extend(_eventEmitter[sigInst.id]);
  
      // Binding on kill to clear the references
      sigInst.bind("kill", function() {
        _instance[sigInst.id].kill();
        _instance[sigInst.id] = null;
        _eventEmitter[sigInst.id] = null;
      });
    }
  
    _instance[sigInst.id].init(sigInst, config);
  
    return _eventEmitter[sigInst.id];
  };
  
  window.sigma.prototype.startNoverlap = function(config) {
    var sigInst = window.network;
  
    if (config) {
      window.sigma.configNoverlap(sigInst, config);
    }
    _instance[sigInst.id].start();
  
    return _eventEmitter[sigInst.id];
  };
  
  window.sigma.prototype.isNoverlapRunning = function() {
    var sigInst = window.sigma;
  
    return !!_instance[sigInst.id] && _instance[sigInst.id].running;
  };

  return (
    <div className="layoutSettings settings">
      <p>Options</p>
      <br />
      <div>
        <input
          step={0.1}
          min={0.1}
          max={10}
          defaultValue={nodeMargin.current}
          onChange={event => {
            nodeMargin.current = event.target.value;
          }}
          type="number"
        />
        nodeMargin
      </div>
      <div>
        <input
          step={0.1}
          min={0.1}
          max={10}
          defaultValue={scaleNodes.current}
          onChange={event => {
            scaleNodes.current = event.target.value;
          }}
          type="number"
        />
        scaleNodes
      </div>
      <div>
        <input
          step={1}
          min={0}
          max={10}
          defaultValue={gridSize.current}
          onChange={event => {
            gridSize.current = event.target.value;
          }}
          type="number"
        />
        gridSize
      </div>
      <div>
        <input
          step={0.1}
          min={0.1}
          max={10}
          defaultValue={permittedExpansion.current}
          onChange={event => {
            permittedExpansion.current = event.target.value;
          }}
          type="number"
        />
        permittedExpansion
      </div>
      <div>
        <input
          disabled
          step={1}
          min={0}
          max={10}
          defaultValue={rendererIndex.current}
          onChange={event => {
            rendererIndex.current = event.target.value;
          }}
          type="number"
        />
        rendererIndex
      </div>
      <div>
        <input
          step={0.1}
          min={0.1}
          max={10}
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
          step={0.1}
          min={0.1}
          max={10}
          defaultValue={maxIterations.current}
          onChange={event => {
            maxIterations.current = event.target.value;
          }}
          type="number"
        />
        maxIterations
      </div>
      {
        !isRunning ? (
          <button
          onClick={event => {
            var listner = window.network.configNoverlap({
              nodeMargin: Number.parseFloat(nodeMargin.current),
              easing: "quadraticInOut",
              scaleNodes: scaleNodes.current,
              gridSize: gridSize.current,
              permittedExpansion: permittedExpansion.current,
              rendererIndex: rendererIndex.current,
              speed: speed.current,
              maxIterations: maxIterations.current
            });
  
            window.network.startNoverlap();
            setIsRunning(true)
          }}
        >
          Start
        </button>
        ) : (
          <button
          onClick={event => {  
            helloWorker.terminate()
            setIsRunning(false)
          }}
        >
          Stop
        </button>
        )
      }

    </div>
  );
}

export { NoverlapUI };
