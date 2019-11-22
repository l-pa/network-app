import React, { useRef, useState, useEffect } from "react";
import "./NodeDetail.css";
import { HuePicker } from "react-color";
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

import {
  edgeLabelSizes,
  edgeShapes,
  layouts,
  shapes,
  nodeSizeArr
} from "./statArrays";
import SigmaNodes from "./SigmaNodes";

export default function GroupDetail(props) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const label = useRef(props.id);
  const colorInput = useRef();
  const color = useRef();

  const size = useRef(1);
  const shape = useRef(shapes[0]);

  return (
    <div className="window">
      <div
        role="button"
        tabIndex="-1"
        className="close"
        onClick={() => {
          props.setVisible(false);
        }}
      >
        X
      </div>
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

        <SettingsSubTitle>Color</SettingsSubTitle>
        <div>
          <SettingsInput
            ref={colorInput}
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
                color.current = `rgb(${event.rgb.r},${event.rgb.g},${event.rgb.b})`;
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
                  //     e.size = size.current.value;
                });
                window.network.refresh();
              }}
            >
              Change group
            </SettingsButton>

            {/* <SettingsButton
              onClick={() => {
                const originalGraph = JSON.parse(
                  JSON.stringify(window.network)
                );

                const tmp = new window.sigma();
                tmp.graph.read(JSON.parse(originalGraph));

                props.difference.forEach(element => {
                  tmp.graph.dropNode(element.id);
                });
                console.log(tmp.graph.nodes());

                //   window.network.graph.read(props.nodes);
                //  window.network.refresh();
              }}
            >
              Export selection
            </SettingsButton> */}
          </div>
        </div>
      </pre>
    </div>
  );
}
