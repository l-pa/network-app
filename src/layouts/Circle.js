/* eslint-disable */

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
    Test
} from "../style";


export default function Circle(props) {
    const nodeMargin = useRef(5);

    return (
        <SettingsSubMenu>
            <SettingsInput
                step={1}
                min={1}
                max={1000}
                defaultValue={nodeMargin.current}
                onChange={event => {
                    nodeMargin.current = event.target.value;
                }}
                type="number"
            />
            Node margin
      <SettingsButton
                onClick={event => {
                    const itemsLength = window.network.graph.nodes().length

                    const sortedGraph = window.network.graph.nodes().sort((a, b) => (a.color > b.color) ? 1 : -1)
                    
                    for (var i = 0; i < itemsLength; i++) {
                     //   const x = r * Math.cos(2 * Math.PI * i / itemsLength);
                      //  const y = r * Math.sin(2 * Math.PI * i / itemsLength);

                        const x = Number.parseFloat(nodeMargin.current) + Number.parseFloat(nodeMargin.current) * Math.cos(2 * Math.PI * i / itemsLength);
                        const y =  Number.parseFloat(nodeMargin.current) + Number.parseFloat(nodeMargin.current) * Math.sin(2 * Math.PI * i / itemsLength);

                        sortedGraph[i].x = x* 100;
                        sortedGraph[i].y = y * 100;
                        console.log(sortedGraph[i].x + " " + sortedGraph[i].y);
                        
                        window.network.graph.read(sortedGraph)
                        window.network.refresh();
                    }
                }}
            >
                Random
      </SettingsButton>
        </SettingsSubMenu>
    );
}
