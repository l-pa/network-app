import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import "../loader.css";
import "../gmlparse.js";

import DefaultNetwork from "../DefaultNetwork";

import GroupCanvas from "./GroupCanvas";

import hideMenu from "../assets/hideMenu.svg";
import showMenu from "../assets/showMenu.svg";

import NodeGroups from "./NodeGroups";

import Settings from "./Settings";
import Groups from "./Groups";
import {
  SideBar,
  SettingsSubTitle,
  SettingsTitle,
  HorizontalLine,
  SettingsInput,
  SettingsButton,
  ToggleButton
} from "../style";

// https://medialab.github.io/iwanthue/

function Network(props) {
  const settings = useRef();

  const [defaultNodes, setDefaultNodes] = useState([]);
  const [defaultEdges, setDefaultEdges] = useState([]);

  const [nodeGroups, setNodeGroups] = useState([]);

  const [lasso, setLasso] = useState();

  const [groupArea, setGroupArea] = useState(false);

  const onlyLargestComponent = (nodes, edges) => {
    let n = nodes;
    let e = edges;
    let visited = [];
    const components = [];
    function DFS(node) {
      visited.push(node);
      edges.forEach(edge => {
        if (node == edge.source) {
          if (!visited.includes(edge.target)) {
            DFS(edge.target);
          }
        }

        if (node == edge.target) {
          if (!visited.includes(edge.source)) {
            DFS(edge.source);
          }
        }
      });
    }

    while (nodes.length > 0) {
      DFS(nodes[0].id);
      nodes = nodes.filter(el => !visited.includes(el.id));
      components.push(visited);
      visited = [];
    }
    components.sort(function (a, b) {
      return b.length - a.length;
    });
    console.log(components[0]);

    n = n.filter(node => components[0].includes(node.id));
    e = edges.filter(edge => components[0].includes(edge.source));

    window.network.graph.clear();

    return {
      nodes: n,
      edges: e
    };
  };

  const afterLoad = (nodes, edges) => {
    setDefaultNodes(JSON.parse(JSON.stringify(nodes)));
    setDefaultEdges(JSON.parse(JSON.stringify(edges)));
    if (props.largestComponent) {
      window.network.graph.read(
        onlyLargestComponent(
          window.network.graph.nodes(),
          window.network.graph.edges()
        )
      );
      window.network.refresh();
    }

    window.network.refresh();

    setLasso(
      new window.sigma.plugins.lasso(
        window.network,
        window.network.renderers[0]
      )
    );
    setNodeGroups(val => [...val, window.network.graph.nodes()]);
  };

  useEffect(() => {
    if (lasso) {
      lasso.bind("selectedNodes", function (event) {
        const nodes = event.data;

        if (nodes.length !== 0) {
          setNodeGroups(val => [...val, nodes]);
          window.network.refresh();
        }

        // Do whatever you want with those nodes

        // Eventually unactivate the lasso-tool mode
        lasso.deactivate();
      });
    }
  }, [lasso]);

  useEffect(() => {
    switch (props.network.type) {
      case "json":
        window.sigma.parsers.json(
          props.network.url,
          window.network,
          () => {
            fetch(props.network.url)
              .then(res => res.json())
              .then(res => {
                if (res.settings) {
                  settings.current = res.settings;
                }
                props.setLoading(false);
              });
            afterLoad(
              window.network.graph.nodes(),
              window.network.graph.edges()
            );
          },
          () => {
            props.setLoading(false);
            props.setShowNetwork(false);

            props.setErrorMessage("JSON Parse error");
          }
        );
        break;
      case "gexf":
        window.sigma.parsers.gexf(
          props.network.url,
          window.network,
          () => {
            props.setLoading(false);
            afterLoad(
              window.network.graph.nodes(),
              window.network.graph.edges()
            );
          },
          () => {
            props.setLoading(false);
            props.setShowNetwork(false);
            props.setErrorMessage("GEXF Parse error");
          }
        );
        break;
      case "gml":
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", props.network.url);
        rawFile.onreadystatechange = function () {
          if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status === 0) {
              // console.log(rawFile.responseText[0]);
              const text = rawFile.responseText;
              let parsedGML = {};
              try {
                parsedGML = window.gmlParser.parse(
                  text.substring(text.indexOf("graph"))
                );
              } catch (error) {
                props.setLoading(false);
                props.setShowNetwork(false);
                props.setErrorMessage("GML Parse error");
                return;
              }
              console.log(parsedGML);

              let tmp = 0;
              parsedGML.edges.forEach(element => {
                element.id = tmp;
                tmp++;
              });
              if (props.largestComponent) {
                window.network.graph.read(
                  onlyLargestComponent(parsedGML.nodes, parsedGML.edges)
                );
              } else {
                window.network.graph.read(parsedGML);
              }
              props.setLoading(false);
              afterLoad(
                window.network.graph.nodes(),
                window.network.graph.edges()
              );
            }
          }
        };
        rawFile.send(null);
        break;
      default:
        console.log("Unsupported file");
        props.setLoading(false);
        props.setShowNetwork(false);
        break;
    }
  }, []);

  useEffect(() => {
    window.network.addRenderer({
      type: "canvas",
      container: "container"
    });

    props.renderer.current = props.renderer.current + 1;

    window.sigma.plugins.dragNodes(
      window.network,
      window.network.renderers[Object.keys(window.network.renderers).length - 1]
    );
    window.network.renderers[
      Object.keys(window.network.renderers).length - 1
    ].resize();

    return () => {
      window.sigma.plugins.killDragNodes(window.network);
    };
  }, []);

  return (
    <DefaultNetwork.Provider
      value={{ nodes: defaultNodes, edges: defaultEdges }}
    >
      <div
        id="container"
        style={{
          height: "100vh",
          display: "flex"
        }}
      >
        {props.loading && (
          <div
            style={{
              zIndex: 2,
              display: "block",
              position: "absolute",
              left: "50%"
            }}
            className="loader"
            showScrolY
          >
            Loading...
          </div>
        )}
        <div
          style={{
            display: "flex",
            width: "100vw",
            justifyContent: "space-between"
          }}
        >
          <Groups
            visible={props.hidePanels}
            groupArea={groupArea}
            renderer={props.renderer}
            setNodeGroups={setNodeGroups}
            nodeGroups={nodeGroups}
            setGroupArea={setGroupArea}
          />
          <Settings
            visible={props.hidePanels}
            settings={settings.current}
            setShowNetwork={props.setShowNetwork}
            lasso={lasso}
            fileName={props.fileName}
            setNodeGroups={setNodeGroups}
            nodeGroups={nodeGroups}
            groupArea={groupArea}
            selectNodesButton={groupArea}
          />
        </div>
      </div>
    </DefaultNetwork.Provider>
  );
}

export default Network;
