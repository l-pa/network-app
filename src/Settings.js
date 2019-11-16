import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SketchPicker } from "react-color";
import NodeDetail from "./NodeDetail";

import { ForceAtlas2 } from "./layouts/ForceAtlas2";
import { RandomLayout } from "./layouts/RandomLayout";
import { NoverlapUI } from "./layouts/Noverlap";
import { FruchtermanReingold } from "./layouts/FruchtermanReingold";
import SigmaNodes from "./SigmaNodes";

const SideBar = styled.div`
  font-family: "Open Sans", Helvetica, sans-serif;
  width: 20vw;
  background: #1d2026;
  z-index: 1;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 100;

  @media only screen and (max-width: 900px) {
    .sidePanel {
      width: 15em;
    }
`;

const SettingsButton = styled.button`
  margin-left: 2em;
  margin-right: 2em;
  padding: 0.5em;
  background-color: #3c5da1;
  border-style: none;
  margin: 0.5em;
  color: white;
  font-weight: 700;
  font-family: "Open Sans", Helvetica, sans-serif;
  text-transform: uppercase;
  font-size: 0.85em;
  opacity: 1;
  transition: 0.3s;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  :hover {
    opacity: 0.8;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

const HorizontalLine = styled.hr`
  width: 75%;
  border-top: 1px solid #8c8b8b;
  margin-top: 1em;
  margin-bottom: 1em;
`;

const SettingsSelect = styled.select``;

const SettingsInput = styled.input`
  display: flex;
`;

const SettingsTitle = styled.div`
  margin-left: 2em;
  margin-right: 2em;

  margin-bottom: 0;
  text-transform: uppercase;
  text-align: center;
  font-size: 1.5em;
  font-weight: bold;

  background-color: #282c34;
  padding-top: 5px;
  padding-bottom: 5px;
`;

const SettingsSubMenu = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-left: 2em;
  margin-right: 2em;
`;

export default function Settings(props) {
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

  const nodeSizeArr = ["default", "fixed", "degree", "degreeIn", "degreeOut"];

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

  useEffect(() => {
    // second create size for every node
    switch (nodeSize) {
      case "default":
        for (let i = 0; i < window.network.graph.nodes().length; i++) {
          window.network.graph.nodes()[i].size = props.defaultNodeSizes[i].size;
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

      case "degreeIn":
        for (let i = 0; i < window.network.graph.nodes().length; i++) {
          const degree = window.network.graph.degree(
            window.network.graph.nodes()[i].id,
            "in"
          );
          if (degree === 0) {
            window.network.graph.nodes()[i].size = 1;
          } else {
            window.network.graph.nodes()[i].size = 1 * Math.sqrt(degree);
          }
        }
        break;

      case "degreeOut":
        for (let i = 0; i < window.network.graph.nodes().length; i++) {
          const degree = window.network.graph.degree(
            window.network.graph.nodes()[i].id,
            "out"
          );
          if (degree === 0) {
            window.network.graph.nodes()[i].size = 1;
          } else {
            window.network.graph.nodes()[i].size = Math.sqrt(degree);
          }
        }
        break;

      default:
        break;
    }
    window.network.refresh();
  }, [props.defaultNodeSizes, nodeSize]);

  useEffect(() => {
    // TODO

    window.network.bind("clickNode", node => {
      setShowNodeDetail(true);
      setNodeDetail(node);
      console.log(node);
    });

    //  window.network.bind("overNode", node => {});
  }, []);

  useEffect(() => {
    if (window.network && props.settings) {
      Object.keys(props.settings).forEach(function(key) {
        window.network.settings(key, props.settings[key]);
      });
      window.network.refresh();
    }
  }, [props.settings]);

  return (
    <SideBar>
      <SettingsButton
        onClick={() => {
          props.setShowNetwork(false);
          window.network.graph.clear();
        }}
      >
        Home
      </SettingsButton>
      <HorizontalLine />
      <SettingsSubMenu>
        <SettingsTitle>Export</SettingsTitle>
        <HorizontalLine />
        <SettingsButton
          onClick={() => {
            window.network.toJSON({
              download: true,
              pretty: true,
              filename: "myGraph.json",
              settings: {
                defaultNodeType: shape,
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
              }
            });
          }}
        >
          Json
        </SettingsButton>
        <SettingsButton
          onClick={() => {
            window.network.toGEXF({
              renderer: window.network.renderers[0],
              download: true
            });
          }}
        >
          Gexf
        </SettingsButton>
        <SettingsButton
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
        </SettingsButton>
      </SettingsSubMenu>
      {nodeDetail && showNodeDetail && (
        <div>
          <NodeDetail node={nodeDetail} setVisibility={setShowNodeDetail} />
          <hr />
        </div>
      )}
      <HorizontalLine />
      <SettingsSubMenu>
        <SettingsTitle>Node</SettingsTitle>
        <HorizontalLine />
        <SettingsTitle>Node type</SettingsTitle>
        <SettingsSelect
          onChange={event => {
            setShape(event.target.selectedOptions[0].value);
          }}
        >
          {shapes.map((o, i, a) => {
            return <option value={o}>{o}</option>;
          })}
        </SettingsSelect>
        <SettingsTitle>Node size</SettingsTitle>
        <SettingsSelect
          onChange={event => {
            setNodeSize(event.target.selectedOptions[0].value);
          }}
        >
          {nodeSizeArr.map((o, i, a) => {
            return <option value={o}>{o}</option>;
          })}
        </SettingsSelect>
        <SettingsTitle>Max size of nodes e</SettingsTitle>
        <SettingsInput
          defaultValue={maxNodeSize}
          step={1}
          min={1}
          max={100}
          type="number"
          onChange={event => {
            setMaxNodeSize(event.target.value);
          }}
        />
      </SettingsSubMenu>

      <HorizontalLine />
      <SettingsSubMenu>
        <SettingsTitle>Label</SettingsTitle>
        <HorizontalLine />
        <SettingsTitle>Label threshold</SettingsTitle>
        <SettingsInput
          defaultValue={labelThreshold}
          step={1}
          min={1}
          max={100}
          type="number"
          onChange={event => {
            setLabelThreshold(event.target.value);
          }}
        />

        {/* Small test
        The minimum size a node must have on screen to see its label displayed.
        */}
        <SettingsTitle>Label size</SettingsTitle>
        <SettingsSelect
          onChange={event => {
            setEdgeLabelSize(event.target.selectedOptions[0].value);
          }}
        >
          {edgeLabelSizes.map((o, i, a) => {
            return <option value={o}>{o}</option>;
          })}
        </SettingsSelect>
        <SettingsTitle>Label pow ratio</SettingsTitle>

        {edgeLabelSize === "fixed" ? (
          <div>
            <SettingsInput
              disabled
              type="number"
              onChange={event => {
                setEdgeLabelSizePowRatio(event.target.value);
              }}
            />
            <small>Available with proportional edge label type</small>
          </div>
        ) : (
          <SettingsInput
            type="number"
            onChange={event => {
              setEdgeLabelSizePowRatio(event.target.value);
            }}
          />
        )}
        {/* 
        Available with proportional edge label type
        */}

        <SettingsTitle>Label color</SettingsTitle>
        <SettingsInput
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
      </SettingsSubMenu>

      <HorizontalLine />
      <SettingsSubMenu>
        <SettingsTitle>Edge</SettingsTitle>
        <HorizontalLine />
        <SettingsTitle>Edge color</SettingsTitle>
        <SettingsInput
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

        <SettingsTitle>Edge shape</SettingsTitle>
        <SettingsSelect
          onChange={event => {
            setEdgeShape(event.target.selectedOptions[0].value);
          }}
        >
          {edgeShapes.map((o, i, a) => {
            return <option value={o}>{o}</option>;
          })}
        </SettingsSelect>

        <SettingsTitle>Directed</SettingsTitle>
        {/* <SettingsInput
          type="checkbox"
          onChange={event => {
            if (event.target.checked) {
              window.network.graph.edges().forEach(element => {
                element.type = "arrow";
              });
            } else {
              window.network.graph.edges().forEach(element => {
                element.type = "";
              });
            }
            window.network.refresh();
          }}
        >
          Directed
        </SettingsInput> */}
      </SettingsSubMenu>

      <HorizontalLine />
      <SettingsSubMenu>
        <SettingsTitle>Layout</SettingsTitle>
        <HorizontalLine />
        <SettingsSelect
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
        </SettingsSelect>
        {renderLayoutOptions(selectedLayout)}
      </SettingsSubMenu>
      <SigmaNodes
        settings={{
          defaultNodeType: shape,
          defaultNodeColor: nodeColor,
          labelSizeRatio: edgeLabelSizePowRatio,
          labelSize: edgeLabelSize,
          defaultEdgeType: edgeShape,
          edgeColor: "default",
          defaultEdgeColor: edgeColor,
          labelThreshold,
          defaultLabelColor: labelColor,
          maxNodeSize,
          borderSize: 2,
          defaultNodeBorderColor: "#fff",
          defaultEdgeHoverColor: "#fff",
          edgeHoverSizeRatio: 3,
          edgeHoverColor: "default",
          minArrowSize: 10
        }}
        showNodeDetail={setShowNodeDetail}
        setSelectedNode={setNodeDetail}
      />
    </SideBar>
  );
}
