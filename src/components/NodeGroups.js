import React, { useState } from "react";
import styled from "styled-components";
import GroupDetail from "./GroupDetail";

export default function NodeGroups(props) {
  const Title = styled.h4`
    text-align: center;
    margin-bottom: 10px;
    padding-top: 10px;
  `;
  const Decription = styled.p`
    text-align: center;
    margin: 0;
    padding-bottom: 10px;
  `;

  const Group = styled.div`
    background-color: ${props =>
      props.active ? props.color : `${props.color}`};
    margin-top: 1em;
    &:hover {
      background-color: ${props => props.color};
      transition: background-color 100ms linear;
    }
  `;

  const Bold = styled.text`
    font-weight: bold;
  `;

  const [label, setLabel] = useState(props.id);
  const [change, setChange] = useState(false);

  const changeLabel = customId => {
    setLabel(customId);
  };

  const setVisible = val => {
    setShowGroupDetail(val);
  };

  const difference = window.network.graph
    .nodes()
    .filter(x => !props.nodes.includes(x));
  const [showGroupDetail, setShowGroupDetail] = useState(false);

  return (
    <div>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          window.network.graph.nodes().forEach(e => (e.hidden = false));

          difference.forEach(function (node) {
            node.hidden = true;
          });

          window.network.refresh();
          console.log("active ", props.id);
          props.activeGroup(props.id);
        }}
      >
        {props.id === 0 ? (
          <Group active={props.active} color="#ff5722">
            <Title>All nodes </Title>
            <Decription>
              {" "}
              Nodes
{' '}
              <Bold>{props.nodes.length}</Bold>{" "}
            </Decription>
          </Group>
        ) : (
            <Group
              active={props.active}
              color={props.nodes[0].color}
              onClick={() => {
                setShowGroupDetail(true);
              }}
            >
              <Title>{label}</Title>
              <Decription>
                {" "}
              Nodes
{' '}
                <Bold>{props.nodes.length}</Bold>{" "}
              </Decription>
              {props.active && (
                <GroupDetail
                  id={label}
                  index={props.index}
                  deleteGroup={props.deleteGroup}
                  nodes={props.nodes}
                  changeLabel={changeLabel}
                  visible={props.active}
                  setVisible={setVisible}
                  difference={difference}
                  change={setChange}
                />
              )}
            </Group>
          )}
      </div>
    </div>
  );
}
