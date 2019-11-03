import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import "./loader.css";
import { SketchPicker } from "react-color";
import SigmaNodes from "./SigmaNodes";
import NodeDetail from "./NodeDetail";
import { ForceAtlas2 } from "./layouts/ForceAtlas2";
import { RandomLayout } from "./layouts/RandomLayout";
import { NoverlapUI } from "./layouts/Noverlap";
import { FruchtermanReingold } from "./layouts/FruchtermanReingold";
import "./gmlparse.js";

function Network(props) {
  const shapes = [
    "def",
    "pacman",
    "star",
    "equilateral",
    "cross",
    "diamond",
    "circle",
    "square"
  ];
  const edgeShapes = ["def", "curve"];
  const edgeLabelSizes = ["fixed", "proportional"];
  const layouts = ["forceAtlas2", "random", "noverlap", "FruchtermanReingold"];

  const nodeSizeArr = ["default", "fixed", "degree"];

  const [shape, setShape] = useState(shapes[0]);
  const [edgeLabelSize, setEdgeLabelSize] = useState(edgeLabelSizes[0]);
  const [edgeShape, setEdgeShape] = useState(edgeShapes[0]);

  const [edgeColor, setEdgeColor] = useState("#000");
  const [nodeColor, setNodeColor] = useState("#000");
  const [labelColor, setLabelColor] = useState("#fff");

  const [nodeSize, setNodeSize] = useState(nodeSizeArr[0]);

  const [selectedLayout, setSelectedLayout] = useState(layouts[0]);

  const [showNodeDetail, setShowNodeDetail] = useState(false);
  const [nodeDetail, setNodeDetail] = useState(null);
  const [edgeLabelSizePowRatio, setEdgeLabelSizePowRatio] = useState(0.8);
  const [maxNodeSize, setMaxNodeSize] = useState(10);
  const [labelThreshold, setLabelThreshold] = useState(3);

  const [showColorPickerNode, setShowColorPickerNode] = useState(false);
  const [showColorPickerEdge, setShowColorPickerEdge] = useState(false);
  const [showColorPickerLabel, setShowColorPickerLabel] = useState(false);

  const defaultNodeSizes = useRef([]);

  useEffect(() => {
    window.network.addRenderer({
      type: "canvas",
      container: "container"
    });

    window.sigma.plugins.dragNodes(
      window.network,
      window.network.renderers[Object.keys(window.network.renderers).length - 1]
    );

    switch (props.network.type) {
      case "json":
        window.sigma.parsers.json(props.network.url, window.network, () => {
          fetch(props.network.url)
            .then(res => res.json())
            .then(res => {
              if (res.settings) {
                try {
                  console.log(res.settings);
                  setShape(res.settings.defaultNodeType);
                  setMaxNodeSize(res.settings.maxNodeSize);
                  setEdgeLabelSizePowRatio(res.settings.labelSizeRatio);
                  setEdgeLabelSize(res.settings.labelSize);
                  setEdgeShape(res.settings.defaultEdgeType);
                  setEdgeColor(res.settings.defaultEdgeColor);
                  setLabelThreshold(res.settings.labelThreshold);
                  setLabelColor(res.settings.defaultLabelColor);
                } catch (e) {
                  console.log(e);
                }
              }
              props.setLoading(false);
            });
          defaultNodeSizes.current = window.network.graph.nodes().slice();

          window.network.refresh();
        });
        break;
      case "gexf":
        window.sigma.parsers.gexf(props.network.url, window.network, () => {
          console.log("LOADED");
          props.setLoading(false);
          window.network.refresh();
          defaultNodeSizes.current = window.network.graph.nodes().slice();
        });
        break;
      case "gml":
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", props.network.url);
        rawFile.onreadystatechange = function() {
          if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
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
              defaultNodeSizes.current = window.network.graph.nodes().slice();
            }
          }
        };

        rawFile.send(null);
        break;
      default:
        console.log("Unsupported file");
        break;
    }
    return () => {
      window.sigma.plugins.killDragNodes(window.network);
    };
  }, []);

  useEffect(() => {
    // second create size for every node
    switch (nodeSize) {
      case "default":
        for (let i = 0; i < window.network.graph.nodes().length; i++) {
          window.network.graph.nodes()[i].size =
            defaultNodeSizes.current[i].size;
        }
        break;

      case "fixed":
        for (let i = 0; i < window.network.graph.nodes().length; i++) {
          window.network.graph.nodes()[i].size = 1;
        }
        break;

      case "degree":
        for (let i = 0; i < window.network.graph.nodes().length; i++) {
          const degree = window.network.graph.degree(
            window.network.graph.nodes()[i].id
          );
          window.network.graph.nodes()[i].size = 1 * Math.sqrt(degree);
        }
        break;

      default:
        break;
    }
    window.network.refresh();
  }, [nodeSize]);

  const renderLayoutOptions = layout => {
    switch (layout) {
      case layouts[0]:
        return <ForceAtlas2 />;
      case layouts[1]:
        return <RandomLayout />;
      case layouts[2]:
        return <NoverlapUI />;
      case layouts[3]:
        return <FruchtermanReingold />;
      default:
        return null;
    }
  };

  return (
    <div
      id="container"
      style={{ height: "100vh", display: "flex", flexDirection: "row-reverse" }}
    >
      <div className="sidePanel">
        <div style={{ marginTop: "2em" }} />
        <button
          type="button"
          style={{ marginLeft: "2em", marginRight: "2em" }}
          onClick={() => {
            props.setShowNetwork(false);
            window.network.graph.clear();
          }}
        >
          Home
        </button>
        <hr />
        <div className="settingsCattegory">
          <h2>Export</h2>
          <hr />
        </div>
        <button
          type="button"
          style={{ marginLeft: "2em", marginRight: "2em" }}
          onClick={() => {
            window.network.toJSON({
              download: true,
              pretty: true,
              filename: "myGraph.json",
              settings: {
                labelSizeRatio: edgeLabelSizePowRatio,
                labelSize: edgeLabelSize,
                defaultEdgeType: edgeShape,
                defaultNodeColor: "#fff",
                defaultNodeType: shape,
                edgeColor: "default",
                defaultEdgeColor: edgeColor,
                labelThreshold,
                defaultLabelColor: labelColor,
                maxNodeSize,
                borderSize: 2,
                defaultNodeBorderColor: "#fff",
                defaultEdgeHoverColor: "#fff",
                edgeHoverSizeRatio: 3,
                edgeHoverColor: "default"
              }
            });
          }}
        >
          JSON
        </button>

        <button
          type="button"
          style={{ marginLeft: "2em", marginRight: "2em" }}
          onClick={() => {
            window.network.toGEXF({
              renderer: window.network.renderers[0],
              download: true
            });
          }}
        >
          GEXF
        </button>
        <button
          type="button"
          style={{ marginLeft: "2em", marginRight: "2em" }}
          onClick={() => {
            window.network.toSVG({
              download: true,
              filename: "my-fancy-graph.svg",
              labels: true,
              classes: false,
              data: true
            });
          }}
        >
          SVG
        </button>
        <hr />

        {nodeDetail && showNodeDetail && (
          <div>
            <NodeDetail node={nodeDetail} setVisibility={setShowNodeDetail} />
            <hr />
          </div>
        )}
        <div className="settingsCattegory">
          <h2>Node</h2>
          <hr />

          <div className="settings">
            <p>Node color</p>
            <input
              value={nodeColor}
              onClick={() => {
                setShowColorPickerNode(val => !val);
              }}
            />
            {showColorPickerNode && (
              <SketchPicker
                color={nodeColor}
                onChangeComplete={event => {
                  setNodeColor(event.hex);
                }}
              />
            )}
          </div>
          <div className="settings">
            <p>Node type</p>
            <select
              onChange={event => {
                setShape(event.target.selectedOptions[0].value);
              }}
            >
              {shapes.map((o, i, a) => {
                return <option value={o}>{o}</option>;
              })}
            </select>
          </div>

          <div className="settings">
            <p>Node size</p>
            <select
              onChange={event => {
                setNodeSize(event.target.selectedOptions[0].value);
              }}
            >
              {nodeSizeArr.map((o, i, a) => {
                return <option value={o}>{o}</option>;
              })}
            </select>
          </div>
          <div className="settings">
            <p>Max size of nodes</p>
            <input
              defaultValue={maxNodeSize}
              step={1}
              min={1}
              max={100}
              type="number"
              onChange={event => {
                setMaxNodeSize(event.target.value);
              }}
            />
          </div>
        </div>
        <hr />

        <div className="settingsCattegory">
          <h2>Label</h2>
          <hr />

          <div className="settings">
            <p>Label threshold</p>
            <input
              defaultValue={labelThreshold}
              step={1}
              min={1}
              max={100}
              type="number"
              onChange={event => {
                setLabelThreshold(event.target.value);
              }}
            />
            <small>
              The minimum size a node must have on screen to see its label
              displayed.
            </small>
          </div>
          <div className="settings">
            <p>Label sizes</p>
            <select
              onChange={event => {
                setEdgeLabelSize(event.target.selectedOptions[0].value);
              }}
            >
              {edgeLabelSizes.map((o, i, a) => {
                return <option value={o}>{o}</option>;
              })}
            </select>
          </div>
          <div className="settings">
            <p>Label Size PowRatio</p>
            {edgeLabelSize === "fixed" ? (
              <div>
                <input
                  disabled
                  type="number"
                  onChange={event => {
                    setEdgeLabelSizePowRatio(event.target.value);
                  }}
                />
                <br />
                <small>Available with proportional edge label type</small>
              </div>
            ) : (
              <input
                type="number"
                onChange={event => {
                  setEdgeLabelSizePowRatio(event.target.value);
                }}
              />
            )}
          </div>
          <div className="settings">
            <p>Label color</p>
            <input
              value={labelColor}
              onClick={() => {
                setShowColorPickerLabel(val => !val);
              }}
            />
            {showColorPickerLabel && (
              <SketchPicker
                color={labelColor}
                onChangeComplete={event => {
                  setLabelColor(event.hex);
                }}
              />
            )}
          </div>
        </div>
        <hr />

        <div className="settingsCattegory">
          <h2>Edge</h2>
          <hr />

          <div className="settings">
            <p>Edge color</p>
            <input
              disabled
              value={edgeColor}
              onClick={() => {
                setShowColorPickerEdge(val => !val);
              }}
            />
            {showColorPickerEdge && (
              <SketchPicker
                color={edgeColor}
                onChangeComplete={event => {
                  setEdgeColor(event.hex);
                }}
              />
            )}
          </div>
          <div className="settings">
            <p>Edge shape</p>
            <select
              onChange={event => {
                setEdgeShape(event.target.selectedOptions[0].value);
              }}
            >
              {edgeShapes.map((o, i, a) => {
                return <option value={o}>{o}</option>;
              })}
            </select>
          </div>
        </div>
        <hr />

        <div className="settingsCattegory">
          <h2>Layout</h2>
          <hr />

          <div className="settings">
            <select
              onChange={event => {
                if (event.target.selectedOptions[0].value !== selectedLayout) {
                  // REFACTOR - LAYOUT.STOP() ...
                  setSelectedLayout(event.target.selectedOptions[0].value);
                  //   networkRef.current.stopForceAtlas2()
                }
              }}
            >
              {layouts.map((o, i, a) => {
                return <option value={o}>{o}</option>;
              })}
            </select>
          </div>
          {renderLayoutOptions(selectedLayout)}
        </div>
        <div style={{ marginBottom: "2em" }} />
      </div>
      {props.loading && <div className="loader">Loading...</div>}
      <SigmaNodes
        nodeType={shape}
        settings={{
          defaultNodeColor: nodeColor,
          labelSizeRatio: edgeLabelSizePowRatio,
          labelSize: edgeLabelSize,
          defaultEdgeType: edgeShape,
          defaultNodeColor: "#fff",
          edgeColor: "default",
          defaultEdgeColor: edgeColor,
          labelThreshold,
          defaultLabelColor: labelColor,
          maxNodeSize,
          borderSize: 2,
          defaultNodeBorderColor: "#fff",
          defaultEdgeHoverColor: "#fff",
          edgeHoverSizeRatio: 3,
          edgeHoverColor: "default"
        }}
        showNodeDetail={setShowNodeDetail}
        setSelectedNode={setNodeDetail}
      />
    </div>
  );
}

export default Network;
