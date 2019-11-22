import React, { useState } from "react";
import styled from "styled-components";
import GroupDetail from "./GroupDetail";

export default function NodeGroups(props) {
  const Title = styled.h4`
    text-align: center;
    margin-bottom: 10px;
    margin-top: 10px;
  `;
  const Decription = styled.p`
    text-align: center;
    margin: 0;
    padding-bottom: 10px;
  `;

  const Group = styled.div`
    background-color: #ff5722;
    margin-top: 1em;
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
      onClick={() => {
        window.network.graph.nodes().forEach(e => (e.hidden = false));

        difference.forEach(function(node) {
          node.hidden = true;
        });

        // Refresh the renderers to make the changes effective:
        window.network.refresh();
      }}
    >
      {props.id === 0 ? (
        <Group>
          <Title>All nodes </Title>
          <Decription>
            Nodes
            {props.nodes.length}
          </Decription>
        </Group>
      ) : (
        <Group
          onClick={() => {
            setShowGroupDetail(true);
          }}
        >
          <Title>{label}</Title>
          <Decription>
            Nodes
            {props.nodes.length}
          </Decription>
        </Group>
      )}
      {showGroupDetail && (
        <GroupDetail
          id={label}
          nodes={props.nodes}
          changeLabel={changeLabel}
          visible={showGroupDetail}
          setVisible={setVisible}
          difference={difference}
        />
      )}
    </div>
  );
}
