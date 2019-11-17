import React, { useState, useEffect, useRef } from "react";
import { SketchPicker } from "react-color";

// https://feathericons.com/

import hideMenu from "./assets/hideMenu.svg";
import showMenu from "./assets/showMenu.svg";

import {
  HideMenu,
  SettingsButton,
  SettingsInput,
  SettingsSubTitle,
  SettingsSelect,
  HorizontalLine,
  SettingsTitle,
  SettingsSubMenu,
  SideBar,
  ToggleButton,
  SettingsInputCheckbox
} from "./style";

import NodeDetail from "./NodeDetail";

import ForceAtlas2 from "./layouts/ForceAtlas2";
import RandomLayout from "./layouts/RandomLayout";
import NoverlapUI from "./layouts/Noverlap";
import FruchtermanReingold from "./layouts/FruchtermanReingold";
import SigmaNodes from "./SigmaNodes";

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
  const layouts = [
    "Force atlas 2",
    "Random",
    "No overlap",
    "Fruchterman Reingold"
  ];

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
  const [showLabel, setShowLabel] = useState(true);

  const [showColorPickerNode, setShowColorPickerNode] = useState(false);
  const [showColorPickerEdge, setShowColorPickerEdge] = useState(false);
  const [showColorPickerLabel, setShowColorPickerLabel] = useState(false);

  const [showSideMenu, setShowSideMenu] = useState(true);

  const edgeShapeRef = useRef();

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
    if (props.settings) {
      console.log("Settings loaded");

      setShape(props.settings.defaultNodeType);
      setEdgeLabelSize(props.settings.labelSize);
      setEdgeShape(props.settings.defaultEdgeType);
      // setEdgeColor(props.settings.defaultEdgeColor)
      // setNodeColor(props.settings.defaultNodeColor)
      setLabelColor(props.settings.defaultLabelColor);

      setNodeSize(props.settings.nodeSize);

      setEdgeLabelSizePowRatio(props.settings.labelSizeRatio);
      setMaxNodeSize(props.settings.maxNodeSize);
      setLabelThreshold(props.settings.labelThreshold);
      setShowLabel(props.settings.drawLabels);
    }

    // if (window.network && props.settings) {
    //   Object.keys(props.settings).forEach(function(key) {
    //     window.network.settings(key, props.settings[key]);
    //   });
    //   window.network.refresh();
    // }
  }, [props.settings]);

  return (
    <div style={{ display: "flex", flexDirection: "row", zIndex: 1 }}>
      <ToggleButton
        onClick={() => {
          setShowSideMenu(v => !v);
        }}
      >
        {showSideMenu ? (
          <img src={hideMenu} alt="" style={{ color: "white" }} />
        ) : (
          <img src={showMenu} alt="" style={{ color: "white" }} />
        )}
      </ToggleButton>
      <SideBar show={showSideMenu}>
        <br />
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
                  defaultNodeColor: nodeColor,
                  labelSizeRatio: edgeLabelSizePowRatio,
                  labelSize: edgeLabelSize,
                  defaultEdgeType: edgeShape,
                  defaultEdgeColor: edgeColor,
                  labelThreshold,
                  defaultLabelColor: labelColor,
                  maxNodeSize,
                  nodeSize,
                  borderSize: 2,
                  defaultNodeBorderColor: "#fff",
                  defaultEdgeHoverColor: "#fff",
                  edgeHoverSizeRatio: 3,
                  edgeHoverColor: "default",
                  edgeColor: "default",
                  minArrowSize: 10,
                  drawLabels: showLabel
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
          <SettingsSubTitle>Node type</SettingsSubTitle>
          <SettingsSelect
            value={shape}
            onChange={event => {
              setShape(event.target.selectedOptions[0].value);
            }}
          >
            {shapes.map((o, i, a) => {
              return <option value={o}>{o}</option>;
            })}
          </SettingsSelect>
          <SettingsSubTitle>Node size</SettingsSubTitle>
          <SettingsSelect
            value={nodeSize}
            onChange={event => {
              setNodeSize(event.target.selectedOptions[0].value);
            }}
          >
            {nodeSizeArr.map((o, i, a) => {
              return <option value={o}>{o}</option>;
            })}
          </SettingsSelect>
          <SettingsSubTitle>Max size of nodes</SettingsSubTitle>
          <SettingsInput
            value={maxNodeSize}
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
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <SettingsInput
              checked={showLabel}
              type="checkbox"
              onChange={event => {
                setShowLabel(event.target.checked);
              }}
            />
            <SettingsSubTitle>Show labels</SettingsSubTitle>
          </div>
          {/* <div style={{ display: "flex", alignItems: "baseline" }}>
            <SettingsInput
              defaultChecked={true}
              type="checkbox"
              onChange={event => {
                setShowLabel(event.target.checked);
              }}
            />
            <SettingsSubTitle>Same color as node</SettingsSubTitle>
          </div> */}
          <SettingsSubTitle>Label threshold</SettingsSubTitle>
          <SettingsInput
            value={labelThreshold}
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
          {/* Small test
        The minimum size a node must have on screen to see its label displayed.
      */}
          <SettingsSubTitle>Label size</SettingsSubTitle>
          <SettingsSelect
            value={edgeLabelSize}
            onChange={event => {
              setEdgeLabelSize(event.target.selectedOptions[0].value);
            }}
          >
            {edgeLabelSizes.map((o, i, a) => {
              return <option value={o}>{o}</option>;
            })}
          </SettingsSelect>
          <SettingsSubTitle>Label pow ratio</SettingsSubTitle>
          {edgeLabelSize === "fixed" ? (
            <div>
              <small>Available with proportional edge label type</small>
            </div>
          ) : (
            <SettingsInput
              value={edgeLabelSizePowRatio}
              type="number"
              min={0}
              onChange={event => {
                setEdgeLabelSizePowRatio(event.target.value);
              }}
            />
          )}
          <SettingsSubTitle>Label color</SettingsSubTitle>
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
          <SettingsSubTitle>Edge color</SettingsSubTitle>
          <SettingsInput
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

          <SettingsSubTitle>Edge shape</SettingsSubTitle>
          <SettingsSelect
            value={edgeShape}
            ref={edgeShapeRef}
            onChange={event => {
              setEdgeShape(event.target.selectedOptions[0].value);
            }}
          >
            {edgeShapes.map((o, i, a) => {
              return <option value={o}>{o}</option>;
            })}
          </SettingsSelect>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <SettingsInput
              type="checkbox"
              onChange={event => {
                if (event.target.checked) {
                  window.network.graph.edges().forEach(element => {
                    element.type = "arrow";
                    edgeShapeRef.current.disabled = true;
                  });
                } else {
                  window.network.graph.edges().forEach(element => {
                    element.type = "";
                    edgeShapeRef.current.disabled = false;
                  });
                }
                window.network.refresh();
              }}
            />
            <SettingsSubTitle>Directed</SettingsSubTitle>
          </div>
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
            {layouts.map(o => {
              return <option value={o}>{o}</option>;
            })}
          </SettingsSelect>
          <SettingsSubTitle>Options</SettingsSubTitle>
          {renderLayoutOptions(selectedLayout)}
        </SettingsSubMenu>
        <SigmaNodes
          settings={{
            defaultNodeType: shape,
            defaultNodeColor: nodeColor,
            labelSizeRatio: edgeLabelSizePowRatio,
            labelSize: edgeLabelSize,
            defaultEdgeType: edgeShape,
            defaultEdgeColor: edgeColor,
            labelThreshold,
            defaultLabelColor: labelColor,
            maxNodeSize,
            borderSize: 2,
            defaultNodeBorderColor: "#fff",
            defaultEdgeHoverColor: "#fff",
            edgeHoverSizeRatio: 3,
            edgeHoverColor: "default",
            edgeColor: "default",
            minArrowSize: 10,
            drawLabels: showLabel
          }}
          showNodeDetail={setShowNodeDetail}
          setSelectedNode={setNodeDetail}
        />
        <br />
      </SideBar>
    </div>
  );
}
