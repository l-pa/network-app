import React, { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import "./loader.css";
import SigmaNodes from "./SigmaNodes";
import NodeDetail from "./NodeDetail";
import "./gmlparse.js";

import Settings from "./Settings";

// https://medialab.github.io/iwanthue/

function Network(props) {
  const defaultNodeSizes = useRef([]);
  const settings = useRef();

  const checkFileType = useCallback(() => {
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

          defaultNodeSizes.current = JSON.parse(
            JSON.stringify(window.network.graph.nodes())
          );

          window.network.refresh();
        });
        break;
      case "gexf":
        window.sigma.parsers.gexf(props.network.url, window.network, () => {
          console.log("LOADED");
          props.setLoading(false);
          window.network.refresh();
          defaultNodeSizes.current = JSON.parse(
            JSON.stringify(window.network.graph.nodes())
          );
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
              window.network.refresh();
              defaultNodeSizes.current = JSON.parse(
                JSON.stringify(window.network.graph.nodes())
              );
            }
          }
        };

        rawFile.send(null);
        break;
      default:
        console.log("Unsupported file");
        break;
    }
  }, [props.network]);

  useEffect(() => {
    window.network.addRenderer({
      type: "canvas",
      container: "container"
    });

    checkFileType();
    window.sigma.plugins.dragNodes(
      window.network,
      window.network.renderers[Object.keys(window.network.renderers).length - 1]
    );

    return () => {
      window.sigma.plugins.killDragNodes(window.network);
    };
  }, [checkFileType]);

  return (
    <div
      id="container"
      style={{ height: "100vh", display: "flex", flexDirection: "row-reverse" }}
    >
      <Settings
        settings={settings.current}
        defaultNodeSizes={defaultNodeSizes.current}
        setShowNetwork={props.setShowNetwork}
      />
      {props.loading && <div className="loader">Loading...</div>}
    </div>
  );
}

export default Network;
