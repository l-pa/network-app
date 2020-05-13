import React, { useRef, useState, useContext } from "react";
import "./NodeDetail.css";
import { HuePicker } from "react-color";
import { shapes } from "../statArrays";

import DefaultNetwork from "../DefaultNetwork";

import {
  SettingsInput,
  SettingsSubTitle,
  SettingsSelect,
  SettingsButton
} from "../style";

function NodeDetail(props) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const label = useRef(props.node.data.node.label);
  const colorInput = useRef(props.node.data.node.color);
  const color = useRef(props.node.data.node.color);
  const shape = useRef(shapes[shapes.indexOf(props.node.data.node.type)]);

  const defaultNetwork = useContext(DefaultNetwork);

  const size = useRef(props.node.data.node.size);
  console.log(props.node);

  return (
    <div className="window">
      <div
        role="button"
        tabIndex="-1"
        className="close"
        onClick={() => {
          props.setVisibility(false);
        }}
      >
        X
      </div>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        <div className="option">
          <h2>Label</h2>
          <div key={props.node.data.node.label}>
            <input
              ref={label}
              type="text"
              defaultValue={props.node.data.node.label}
            />
          </div>
        </div>

        <div className="option">
          <h2>Node type</h2>
          <div key={props.node.data.node.size}>
            <SettingsSelect
              defValue={shape}
              onChange={event => {
                shape.current = event.target.selectedOptions[0].value;
              }}
            >
              {shapes.map((o, i, a) => {
                return <option value={o}>{o}</option>;
              })}
            </SettingsSelect>
          </div>
        </div>

        <div className="option">
          <h2>Color</h2>
          <div key={props.node.data.node.color}>
            <input
              ref={colorInput}
              type="text"
              defaultValue={props.node.data.node.color}
              onClick={() => {
                setShowColorPicker(val => !val);
              }}
            />
            <div>
              <HuePicker
                color={colorInput.current}
                width="auto"
                onChangeComplete={event => {
                  colorInput.current.value = `rgb(${event.rgb.r},${event.rgb.g},${event.rgb.b})`;
                  color.current = `rgb(${event.rgb.r},${event.rgb.g},${event.rgb.b})`;
                }}
              />
            </div>
          </div>
        </div>

        <div className="option">
          <h2>Size</h2>
          <div key={props.node.data.node.size}>
            <input
              ref={size}
              type="number"
              defaultValue={props.node.data.node.size}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            <SettingsButton
              type="button"
              onClick={() => {
                props.node.data.node.label = label.current.value;
                props.node.data.node.color = colorInput.current.value;
                props.node.data.node.size = size.current.value;
                props.node.data.node.type = shape.current;
                props.newColor(colorInput.current.value);
                window.network.refresh();
              }}
            >
              Change node
            </SettingsButton>

            <SettingsButton
              type="button"
              onClick={() => {
                defaultNetwork.updateNodes(
                  defaultNetwork.nodes.filter(
                    n => n.id !== props.node.data.node.id
                  )
                );

                defaultNetwork.updateEdges(
                  defaultNetwork.edges.filter(
                    n => n.source !== props.node.data.node.id
                  )
                );
                defaultNetwork.updateEdges(
                  defaultNetwork.edges.filter(
                    n => n.target !== props.node.data.node.id
                  )
                );

                window.network.graph.dropNode(props.node.data.node.id);
                window.network.refresh();
                props.setVisibility(false);
                defaultNetwork.fc(v => !v);
                defaultNetwork.delete(props.node.data.node.id);
              }}
            >
              Delete node
            </SettingsButton>
          </div>

          {
            // button
            //     props.node.data.node.label = label.current.value
            //     props.node.data.node.color = color.current.value
            //     props.node.data.node.size = size.current.value
            //     window.network.graph.addNode({
            //       id: 999, label: label.current.value, color: color.current.value, size: size.current.value
            //     })
            //     window.network.refresh()
            //     setIsDeleted(false)
            //   }}>
            // Add node
            //   </button>
          }
        </div>
        {console.log(props.node.data.node)}

        {/* {JSON.stringify(props.node.data.node, null, 2)} */}
      </pre>
    </div>
  );
}

export default NodeDetail;
