import React, { useRef } from "react";
import { SettingsButton, SettingsSubMenu, SettingsInput } from "../style";

export default function Rotate(props) {
  const angle = useRef(90);
  return (
    /*
    
            double px = 0f;
            double py = 0f;

            for (Node n : graph.getNodes()) {
                double dx = n.x() - px;
                double dy = n.y() - py;

                n.setX((float) (px + dx * cos - dy * sin));
                n.setY((float) (py + dy * cos + dx * sin));
            }
    */

    <SettingsSubMenu>
      Angle
      <SettingsInput
        step={1}
        min={0}
        max={360}
        defaultValue={angle.current}
        onChange={event => {
          angle.current = event.target.value;
        }}
        type="number"
      />
      <SettingsButton
        onClick={event => {
          const sin = Math.sin((-angle.current * Math.PI) / 180);
          const cos = Math.cos((-angle.current * Math.PI) / 180);

          window.network.graph.nodes().forEach(n => {
            const dx = n.x;
            const dy = n.y;

            n.x = dx * cos - dy * sin;
            n.y = dy * cos + dx * sin;
          });
          window.network.refresh();
        }}
      >
        Rotate
      </SettingsButton>
    </SettingsSubMenu>
  );
}
