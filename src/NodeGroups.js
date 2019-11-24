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
    background-color: ${props => (props.active ? "#ff5722" : "#ff572282")};
    margin-top: 1em;
    &:hover {
      background-color: #ff5722;
      transition: background-color 50ms linear;
    }
  `;

  const Bold = styled.text`
    font-weight: bold;
  `;

  const [label, setLabel] = useState(props.id);

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
    <div
      style={{ cursor: "pointer" }}
      onClick={() => {
        window.network.graph.nodes().forEach(e => (e.hidden = false));

        difference.forEach(function(node) {
          node.hidden = true;
        });

        // Refresh the renderers to make the changes effective:
        window.network.refresh();
        props.activeGroup(props.id);
      }}
    >
      {props.id === 0 ? (
        <Group active={props.active}>
          <Title>All nodes </Title>
          <Decription>
            {" "}
            Nodes 
{' '}
<Bold>{props.nodes.length}</Bold>
{' '}
{" "}
          </Decription>
        </Group>
      ) : (
        <Group
          active={props.active}
          onClick={() => {
            setShowGroupDetail(true);
          }}
        >
          <Title>{label}</Title>
          <Decription>
            {" "}
            Nodes 
{' '}
<Bold>{props.nodes.length}</Bold>
{' '}
{" "}
          </Decription>
          {/* <Decription>
            {" "}
            Edges <Bold>{props.edgesL}</Bold>            {" "}
          </Decription> */}
          {props.active && (
            <GroupDetail
              id={label}
              nodes={props.nodes}
              changeLabel={changeLabel}
              visible={props.active}
              setVisible={setVisible}
              difference={difference}
            />
          )}
        </Group>
      )}
    </div>
  );
}
