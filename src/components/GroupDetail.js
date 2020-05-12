import React, { useRef, useState, useContext } from "react";
import "./NodeDetail.css";
import { HuePicker } from "react-color";
import {
  SettingsButton,
  SettingsInput,
  SettingsSubTitle,
  SettingsSelect
} from "../style";

import DefaultNetwork from "../DefaultNetwork";

import { shapes } from "../statArrays";

export default function GroupDetail(props) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const label = useRef(props.id);
  const colorInput = useRef(props.nodes[0].color);

  const size = useRef(props.nodes[0].size);
  const shape = useRef(shapes[shapes.indexOf(props.nodes[0].type)]);

  const defaultNetwork = useContext(DefaultNetwork);

  const arrayToObject = (array, keyField) =>
    array.reduce((obj, item) => {
      obj[item[keyField]] = item;
      return obj;
    }, {});

  return (
    <div className="window" onClick={e => e.stopPropagation()}>
      {/* <div
        role="button"
        tabIndex="-1"
        className="close"
        onClick={() => {
          props.setVisible(false);
        }}
      >
        X
      </div> */}
      <pre style={{ whiteSpace: "pre-wrap" }}>
        <SettingsSubTitle>Group name</SettingsSubTitle>
        <SettingsInput ref={label} defaultValue={props.id} type="text" />

        <SettingsSubTitle>Node type</SettingsSubTitle>
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

        <SettingsSubTitle>Node size</SettingsSubTitle>
        <SettingsInput
          defaultValue={props.nodes[0].size}
          step={1}
          min={1}
          max={100}
          type="number"
          onChange={event => {
            size.current = event.target.value;
          }}
        />
        <SettingsSubTitle>Color</SettingsSubTitle>
        <div>
          <SettingsInput
            ref={colorInput}
            defaultValue={props.nodes[0].color}
            type="text"
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
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            <br />
            <SettingsButton
              type="button"
              onClick={() => {
                props.changeLabel(label.current.value);
                props.nodes.forEach(e => {
                  e.color = colorInput.current.value;
                  e.type = shape.current;
                  e.size = size.current;
                });
                window.network.refresh();
                props.change(v => !v);
                defaultNetwork.fc(v => !v);
              }}
            >
              Change group
            </SettingsButton>

            <SettingsButton
              type="button"
              onClick={() => {
                const nodeArr = arrayToObject(defaultNetwork.nodes, "id");

                props.nodes.forEach(e => {
                  window.network.graph.nodes(e.id).color = nodeArr[e.id].color;

                  if (!nodeArr[e.id].shape) {
                    window.network.graph.nodes(e.id).type = shapes[0];
                  } else {
                    window.network.graph.nodes(e.id).type = nodeArr[e.id].shape;
                  }
                  window.network.graph.nodes(e.id).size = nodeArr[e.id].size;
                });
                props.deleteGroup(props.index);
                window.network.refresh();
              }}
            >
              Delete group
            </SettingsButton>

            <SettingsButton
              onClick={() => {
                const originalGraph = JSON.parse(
                  JSON.stringify(window.network)
                );

                const tmp = new window.sigma();
                tmp.graph.read(JSON.parse(originalGraph));

                props.difference.forEach(element => {
                  tmp.graph.dropNode(element.id);
                });

                tmp.toJSON({
                  download: true,
                  pretty: true,
                  filename: `${label.current.value}.json`,
                  settings: {
                    defaultNodeType: shape.current,
                    defaultNodeColor: colorInput.current,
                    labelThreshold: 0,
                    defaultLabelColor: "#fff",
                    borderSize: 2,
                    defaultNodeBorderColor: "#fff",
                    defaultEdgeHoverColor: "#fff",
                    edgeHoverSizeRatio: 3,
                    edgeHoverColor: "default",
                    edgeColor: "default",
                    minArrowSize: 10
                  }
                });

                //  window.network.graph.read(props.nodes);
                //  window.network.refresh();
              }}
            >
              Export selection
            </SettingsButton>
          </div>
        </div>
      </pre>
    </div>
  );
}
