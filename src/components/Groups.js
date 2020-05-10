import React, { useState, useContext, useEffect } from "react";

import hideMenu from "../assets/hideMenu.svg";
import showMenu from "../assets/showMenu.svg";

import {
  SettingsButton,
  SettingsInput,
  SettingsSubTitle,
  SettingsSelect,
  HorizontalLine,
  SettingsTitle,
  SettingsSubMenu,
  SideBar,
  ToggleButton
} from "../style";

import DefaultNetwork from "../DefaultNetwork";

import NodeGroups from "./NodeGroups";
import GroupCanvas from "./GroupCanvas";

// redux + context !!!

export default function Groups(props) {
  const [showGroups, setShowGroups] = useState(props.visible);
  const [activeGroup, setActiveGroup] = useState(0);

  const deleteGroup = id => {
    props.setNodeGroups(val => val.filter((_, i) => i !== id));
    setActiveGroup(0);
    window.network.graph.nodes().forEach(e => {
      e.hidden = false;
    });
    window.network.refresh();
  };

  const defaultNetwork = useContext(DefaultNetwork);

  return (
    <div style={{ display: "flex", flexDirection: "row-reverse", zIndex: 1 }}>
      <ToggleButton
        onClick={() => {
          setShowGroups(v => !v);
        }}
      >
        {showGroups ? (
          <img src={showMenu} alt="" style={{ color: "white" }} />
        ) : (
            <img src={hideMenu} alt="" style={{ color: "white" }} />
          )}
      </ToggleButton>
      <SideBar show={showGroups} width={10}>
        <br />
        <SettingsTitle>Groups</SettingsTitle>

        <div style={{ display: "flex", alignItems: "baseline" }}>
          <SettingsInput
            type="checkbox"
            defaultChecked={props.groupArea}
            onChange={e => {
              props.setGroupArea(e.target.checked);
            }}
          />
          <SettingsSubTitle>Show groups area</SettingsSubTitle>
        </div>
        <SettingsButton
          onClick={() => {
            setActiveGroup(0);
            // window.network.graph.nodes();
            for (let i = 0; i < defaultNetwork.nodes.length; i++) {
              const element = defaultNetwork.nodes[i];
              window.network.graph.nodes(element.id).type = element.type;
              window.network.graph.nodes(element.id).color = element.color;
              window.network.graph.nodes(element.id).size = element.size;
            }
            window.network.graph.nodes().forEach(e => {
              e.hidden = false;
            });
            props.setNodeGroups([window.network.graph.nodes()]);
          }}
        >
          Delete groups
        </SettingsButton>
        <HorizontalLine />
        <div className="scrollable">
          {props.nodeGroups.map((e, i) => {
            if (i === activeGroup) {
              return (
                <div>
                  <NodeGroups
                    index={i}
                    id={i}
                    nodes={e}
                    active
                    activeGroup={setActiveGroup}
                    deleteGroup={deleteGroup}
                  />
                  {i === 0
                    ? props.groupArea &&
                    i === activeGroup && (
                      <GroupCanvas
                        color="#fff"
                        nodes={e}
                        renderer={props.renderer}
                      />
                    )
                    : props.groupArea &&
                    i === activeGroup && (
                      <GroupCanvas nodes={e} renderer={props.renderer} />
                    )}
                </div>
              );
            }
            return (
              <div>
                <NodeGroups
                  index={i}
                  id={i}
                  nodes={e}
                  activeGroup={setActiveGroup}
                  deleteGroup={deleteGroup}
                />
                {props.groupArea && activeGroup === 0 && (
                  <GroupCanvas nodes={e} renderer={props.renderer} />
                )}
              </div>
            );
          })}
        </div>
      </SideBar>
    </div>
  );
}
