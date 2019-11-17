/* eslint-disable */

import React, { useState, useRef, useEffect } from "react";

import Worker from "worker-loader!./workers/fr.worker.js";

import {
  SettingsButton,
  SettingsInput,
  SettingsSubTitle,
  SettingsSelect,
  HorizontalLine,
  SettingsTitle,
  SettingsSubMenu,
  SideBar,
  Test
} from "../style";

let helloWorker = new Worker();

export default function FruchtermanReingold(props) {
  const autoArea = useRef(false);
  const area = useRef(1);
  const gravity = useRef(1);
  const speed = useRef(0.5);
  const iterations = useRef(100);

  const [isRunning, setIsRunning] = useState(false);

  (function(undefined) {
    // Initialize package:
    window.sigma.utils.pkg("sigma.layouts.fruchtermanReingold");

    /**
     * Sigma Fruchterman-Reingold
     * ===============================
     *
     * Author: Sébastien Heymann @ Linkurious
     * Version: 0.1
     */

    var settings = {
      autoArea: true,
      area: 1,
      gravity: 10,
      speed: 0.1,
      iterations: 1000
    };

    var _instance = {};

    /**
     * Event emitter Object
     * ------------------
     */
    var _eventEmitter = {};

    /**
     * Fruchterman Object
     * ------------------
     */
    function FruchtermanReingold() {
      var self = this;
      this.init = function(sigInst, options) {
        options = options || {};

        helloWorker = new Worker();
        // Properties
        this.sigInst = sigInst;
        this.config = window.sigma.utils.extend(options, settings);
        this.easing = options.easing;
        this.duration = options.duration;

        if (
          !window.sigma.plugins ||
          typeof window.sigma.plugins.animate === "undefined"
        ) {
          throw new Error("sigma.plugins.animate is not declared");
        }
      };

      this.go = function() {
        helloWorker.postMessage({
          run: true,
          nodes: this.sigInst.graph.nodes(),
          edges: this.sigInst.graph.edges(),
          config: this.config
        });

        helloWorker.onmessage = event => {
          console.log(event.data);

          const instanceNodes = this.sigInst.graph.nodes();

          // Apply changes
          for (let i = 0; i < event.data.nodes.length; i++) {
            instanceNodes[i].x = event.data.nodes[i].fr_x;
            instanceNodes[i].y = event.data.nodes[i].fr_y;
          }
          if (event.data.iterCount === 0) {
            const instanceNodes = this.sigInst.graph.nodes();
            for (let i = 0; i < instanceNodes.length; i++) {
              instanceNodes[i].fr = null;
              instanceNodes[i].fr_x = null;
              instanceNodes[i].fr_y = null;
            }
            setIsRunning(false);
          }

          this.sigInst.refresh();
        };
        //  this.stop();
      };

      this.start = function() {
        var nodes = this.sigInst.graph.nodes();

        // Init nodes
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].fr_x = nodes[i].x;
          nodes[i].fr_y = nodes[i].y;
          nodes[i].fr = {
            dx: 0,
            dy: 0
          };
        }

        _eventEmitter[self.sigInst.id].dispatchEvent("start");
        this.go();
      };

      this.stop = function() {
        var nodes = this.sigInst.graph.nodes();

        if (this.easing) {
          _eventEmitter[self.sigInst.id].dispatchEvent("interpolate");
          window.sigma.plugins.animate(
            self.sigInst,
            {
              x: "fr_x",
              y: "fr_y"
            },
            {
              easing: self.easing,
              onComplete: function() {
                self.sigInst.refresh();
                for (var i = 0; i < nodes.length; i++) {
                  nodes[i].fr = null;
                  nodes[i].fr_x = null;
                  nodes[i].fr_y = null;
                }
                _eventEmitter[self.sigInst.id].dispatchEvent("stop");
              },
              duration: self.duration
            }
          );
        } else {
          // Apply changes
          for (var i = 0; i < nodes.length; i++) {
            nodes[i].x = nodes[i].fr_x;
            nodes[i].y = nodes[i].fr_y;
          }

          this.sigInst.refresh();

          for (var i = 0; i < nodes.length; i++) {
            nodes[i].fr = null;
            nodes[i].fr_x = null;
            nodes[i].fr_y = null;
          }
          _eventEmitter[self.sigInst.id].dispatchEvent("stop");
        }
        helloWorker.terminate();
      };

      this.kill = function() {
        this.sigInst = null;
        this.config = null;
        this.easing = null;
      };
    }

    /**
     * Interface
     * ----------
     */

    /**
     * Configure the layout algorithm.
  
     * Recognized options:
     * **********************
     * Here is the exhaustive list of every accepted parameters in the settings
     * object:
     *
     *   {?boolean}           autoArea   If `true`, area will be computed as N².
     *   {?number}            area       The area of the graph.
     *   {?number}            gravity    This force attracts all nodes to the
     *                                   center to avoid dispersion of
     *                                   disconnected components.
     *   {?number}            speed      A greater value increases the
     *                                   convergence speed at the cost of precision loss.
     *   {?number}            iterations The number of iterations to perform
     *                                   before the layout completes.
     *   {?(function|string)} easing     Either the name of an easing in the
     *                                   sigma.utils.easings package or a
     *                                   function. If not specified, the
     *                                   quadraticInOut easing from this package
     *                                   will be used instead.
     *   {?number}            duration   The duration of the animation. If not
     *                                   specified, the "animationsTime" setting
     *                                   value of the sigma instance will be used
     *                                   instead.
     *
     *
     * @param  {sigma}   sigInst The related sigma instance.
     * @param  {object} config  The optional configuration object.
     *
     * @return {sigma.classes.dispatcher} Returns an event emitter.
     */
    window.sigma.layouts.fruchtermanReingold.configure = function(
      sigInst,
      config
    ) {
      if (!sigInst) throw new Error('Missing argument: "sigInst"');
      if (!config) throw new Error('Missing argument: "config"');

      // Create instance if undefined
      if (!_instance[sigInst.id]) {
        _instance[sigInst.id] = new FruchtermanReingold();

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

    /**
     * Start the layout algorithm. It will use the existing configuration if no
     * new configuration is passed.
  
     * Recognized options:
     * **********************
     * Here is the exhaustive list of every accepted parameters in the settings
     * object:
     *
     *   {?boolean}           autoArea   If `true`, area will be computed as N².
     *   {?number}            area       The area of the graph.
     *   {?number}            gravity    This force attracts all nodes to the
     *                                   center to avoid dispersion of
     *                                   disconnected components.
     *   {?number}            speed      A greater value increases the
     *                                   convergence speed at the cost of precision loss.
     *   {?number}            iterations The number of iterations to perform
     *                                   before the layout completes.
     *   {?(function|string)} easing     Either the name of an easing in the
     *                                   sigma.utils.easings package or a
     *                                   function. If not specified, the
     *                                   quadraticInOut easing from this package
     *                                   will be used instead.
     *   {?number}            duration   The duration of the animation. If not
     *                                   specified, the "animationsTime" setting
     *                                   value of the sigma instance will be used
     *                                   instead.
     *
     *
     * @param  {sigma}   sigInst The related sigma instance.
     * @param  {?object} config  The optional configuration object.
     *
     * @return {sigma.classes.dispatcher} Returns an event emitter.
     */
    window.sigma.layouts.fruchtermanReingold.start = function(sigInst, config) {
      if (!sigInst) throw new Error('Missing argument: "sigInst"');

      if (config) {
        this.configure(sigInst, config);
      }

      _instance[sigInst.id].start();

      return _eventEmitter[sigInst.id];
    };

    /**
     * Returns true if the layout has started and is not completed.
     *
     * @param  {sigma}   sigInst The related sigma instance.
     *
     * @return {boolean}
     */
    window.sigma.layouts.fruchtermanReingold.isRunning = function(sigInst) {
      if (!sigInst) throw new Error('Missing argument: "sigInst"');

      return !!_instance[sigInst.id] && _instance[sigInst.id].running;
    };

    /**
     * Returns the number of iterations done divided by the total number of
     * iterations to perform.
     *
     * @param  {sigma}   sigInst The related sigma instance.
     *
     * @return {number} A value between 0 and 1.
     */
    window.sigma.layouts.fruchtermanReingold.progress = function(sigInst) {
      if (!sigInst) throw new Error('Missing argument: "sigInst"');

      return (
        (_instance[sigInst.id].config.iterations -
          _instance[sigInst.id].iterCount) /
        _instance[sigInst.id].config.iterations
      );
    };
  }.call(this));

  useEffect(() => {
    return function unmount() {
      helloWorker.terminate();
    };
  }, []);

  return (
    <SettingsSubMenu>
      <SettingsInput ref={autoArea} type="checkbox" value="linLogMode" />
      autoArea
      <SettingsInput
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
      <SettingsInput
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
      <SettingsInput
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
      <SettingsInput
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
      {!isRunning ? (
        <SettingsButton
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
            console.log(window.network);

            if (window.network) {
              // Start the algorithm:
              window.sigma.layouts.fruchtermanReingold.configure(
                window.network,
                settings
              );
              setIsRunning(true);

              // Bind all events:

              window.sigma.layouts.fruchtermanReingold.start(window.network);
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
