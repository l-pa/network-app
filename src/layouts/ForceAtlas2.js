import React, { useState, useRef, useEffect } from "react";
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
  SettingsInputRange,
  Input
} from "../style";

function ForceAtlas2(props) {
  const linLogMode = useRef(false);
  const outboundAtraction = useRef(false);
  const adjustSizes = useRef(false);
  const strongGravity = useRef(false);
  const barnesHutEnable = useRef(true);
  const barnesHutTheta = useRef(0.5);

  const scalingRatio = useRef(1);
  const gravity = useRef(1);
  const worker = useRef(false);

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    return function unmount() {
      // isRunning false??
      console.log(isRunning);

      window.network.killForceAtlas2();
    };
  }, []);

  return (
    <SettingsSubMenu>
      <SettingsInputCheckbox text="Lin log mod" value={linLogMode} />
      <SettingsInputCheckbox
        text="Outbound attraction distribution"
        value={outboundAtraction}
      />
      <SettingsInputCheckbox text="Strong gravity mode" value={strongGravity} />
      <SettingsInputCheckbox
        text="BarnesHut Optimize"
        value={barnesHutEnable}
        default
      />
      <Input>
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
      </Input>
      <Input>
        BarnesHut Theta
        <SettingsInput
          step={0.1}
          min={0.1}
          max={10}
          defaultValue={barnesHutTheta.current}
          onChange={event => {
            barnesHutTheta.current = event.target.value;
          }}
          type="number"
        />
      </Input>
      <Input>
        Gravity
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
      </Input>
      {!isRunning ? (
        <SettingsButton
          onClick={event => {
            const settings = {
              linLogMode: linLogMode.current.checked,
              outboundAttractionDistribution: outboundAtraction.current.checked,
              adjustSizes: adjustSizes.current.checked,
              strongGravityMode: strongGravity.current.checked,
              barnesHutOptimize: barnesHutEnable.current.checked,
              barnesHutTheta: barnesHutTheta.current,
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
