import React from "react";
import { SettingsButton, SettingsSubMenu } from "../style";

export default function RandomLayout(props) {
  return (
    <SettingsSubMenu>
      <SettingsButton
        onClick={event => {
          window.network.graph.nodes().forEach(n => {
            n.x = Math.random();
            n.y = Math.random();
          });
          window.network.refresh();
        }}
      >
        Random
      </SettingsButton>
    </SettingsSubMenu>
  );
}
