import React, { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import "./loader.css";
import SigmaNodes from "./SigmaNodes";
import NodeDetail from "./NodeDetail";
import "./gmlparse.js";

import Settings from "./Settings";

// https://medialab.github.io/iwanthue/

function Network(props) {
  const settings = useRef();

  const [defaultNodes, setDefaultNodes] = useState([]);

  const [lasso, setLasso] = useState();

  const afterLoad = nodes => {
    setDefaultNodes(JSON.parse(JSON.stringify(nodes)));
    window.network.refresh();

    setLasso(
      new window.sigma.plugins.lasso(
        window.network,
        window.network.renderers[0]
      )
    );
  };

  useEffect(() => {
    switch (props.network.type) {
      case "json":
        window.sigma.parsers.json(props.network.url, window.network, () => {
          fetch(props.network.url)
            .then(res => res.json())
            .then(res => {
              if (res.settings) {
                settings.current = res.settings;
              }
              props.setLoading(false);
            });
          afterLoad(window.network.graph.nodes());
        });
        break;
      case "gexf":
        window.sigma.parsers.gexf(props.network.url, window.network, () => {
          props.setLoading(false);
          afterLoad(window.network.graph.nodes());
        });
        break;
      case "gml":
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", props.network.url);
        rawFile.onreadystatechange = function() {
          if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status === 0) {
              // console.log(rawFile.responseText[0]);
              const text = rawFile.responseText;
              const parsedGML = window.gmlParser.parse(
                text.substring(text.indexOf("graph"))
              );

              let tmp = 0;
              parsedGML.edges.forEach(element => {
                element.id = tmp;
                tmp++;
              });
              window.network.graph.read(parsedGML);
              props.setLoading(false);
              afterLoad(window.network.graph.nodes());
            }
          }
        };

        rawFile.send(null);
        break;
      default:
        console.log("Unsupported file");
        break;
    }
  }, []);

  useEffect(() => {
    window.network.addRenderer({
      type: "canvas",
      container: "container"
    });

    window.sigma.plugins.dragNodes(
      window.network,
      window.network.renderers[Object.keys(window.network.renderers).length - 1]
    );

    return () => {
      window.sigma.plugins.killDragNodes(window.network);
    };
  }, []);

  return (
    <div
      id="container"
      style={{ height: "100vh", display: "flex", flexDirection: "row-reverse" }}
    >
      <Settings
        settings={settings.current}
        defaultNodeSizes={defaultNodes}
        setShowNetwork={props.setShowNetwork}
        lasso={lasso}
      />
      {props.loading && <div className="loader">Loading...</div>}
    </div>
  );
}

export default Network;
