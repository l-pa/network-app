import React, { useState } from "react";

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

import NodeGroups from "./NodeGroups";
import GroupCanvas from "./GroupCanvas";

export default function Groups(props) {
  const [showGroups, setShowGroups] = useState(true);
  const [activeGroup, setActiveGroup] = useState(0);

  const deleteGroup = id => {
    props.setNodeGroups(val => val.filter((_, i) => i !== id));
    window.network.graph.nodes().forEach(e => (e.hidden = false));
    window.network.refresh();
    setActiveGroup(0);
  };

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
            window.network.graph.nodes();
            window.network.graph.nodes().forEach(element => {
              element.color = "#fff";
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
