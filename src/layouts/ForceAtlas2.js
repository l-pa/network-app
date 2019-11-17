import React, { useState, useRef } from "react";
import {
  SettingsButton,
  SettingsInput,
  SettingsSubTitle,
  SettingsSelect,
  HorizontalLine,
  SettingsTitle,
  SettingsSubMenu,
  SideBar,
  SettingsInputCheckbox,
  SettingsInputRange
} from "../style";

function ForceAtlas2(props) {
  const linLogMode = useRef(false);
  const scalingRatio = useRef(1);
  const gravity = useRef(1);
  const worker = useRef(false);

  const [isRunning, setIsRunning] = useState(false);

  return (
    <SettingsSubMenu>
      <SettingsInputCheckbox text="Lin log mod" value={linLogMode} />
      Scaling ratio
      <SettingsInput
        step={0.1}
        min={0.1}
        max={10}
        defaultValue={scalingRatio.current}
        onChange={event => {
          scalingRatio.current = event.target.value;
        }}
        type="number"
      />
      {scalingRatio.current}
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
      {!isRunning ? (
        <SettingsButton
          onClick={event => {
            const settings = {
              linLogMode: linLogMode.current.checked,
              scalingRatio: scalingRatio.current,
              gravity: gravity.current,
              worker: worker.current.checked
            };
            if (window.network) {
              if (!isRunning) {
                window.network.startForceAtlas2(settings);
              } else {
                window.network.configForceAtlas2(settings);
              }
              setIsRunning(true);              
            }
          }}
        >
          Start
        </SettingsButton>
      ) : (
        <SettingsButton
          onClick={event => {
            window.network.killForceAtlas2();
            setIsRunning(false);
          }}
        >
          Stop
        </SettingsButton>
      )}
    </SettingsSubMenu>
  );
}

export default ForceAtlas2;
