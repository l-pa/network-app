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
    
    const r = useRef(Math.max.apply(Math, window.network.graph.nodes().map(function(o) { return o.size; })) * window.network.graph.nodes().length / (2 * Math.PI))
    const minimum = 100
    
    const nodeMargin = useRef(r.current < minimum ? minimum : r.current);
        
    return (
        <SettingsSubMenu>
            {/* <SettingsInput
                step={1}
                min={1}
                max={1000}
                defaultValue={nodeMargin.current}
                onChange={event => {
                    nodeMargin.current = event.target.value;
                }}
                type="number"
            />
            Node margin */}
      <SettingsButton
                onClick={event => {

                    
                    let itemsLength = Number.parseInt(window.network.graph.nodes().length)          
                    
                    const sortedGraph = window.network.graph.nodes().sort((a, b) => (a.color > b.color) ? 1 : -1)
                    
                    const slice = 2 * Math.PI / itemsLength
                    
                    for (var i = 0; i < itemsLength; i++) {
                        const angle = slice * i

                        const x =  nodeMargin.current * Math.cos(angle);
                        const y =  nodeMargin.current * Math.sin(angle);
                        sortedGraph[i].x = x;
                        sortedGraph[i].y = y;
                    }
                    window.network.graph.read(sortedGraph)
                    window.network.refresh();
                }}
            >
                Random
      </SettingsButton>
        </SettingsSubMenu>
    );
}
