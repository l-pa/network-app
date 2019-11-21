import React from "react";
import styled from "styled-components";

import { SettingsButton } from "./style";

export default function NodeGroups(props) {
  const Title = styled.h4`
    text-align: center;
    margin-bottom: 10px;
    margin-top: 10px;
  `;
  const Decription = styled.p`
    text-align: center;
    margin: 0;
    margin-bottom: 10px;
  `;

  const Group = styled.div`
    background-color: #acacac;
    margin-bottom: 1em;
  `;
  return (
    <div
      onClick={() => {
        window.network.graph.nodes().forEach(e => (e.hidden = false));

        console.log(props.nodes);

        const difference = window.network.graph
          .nodes()
          .filter(x => !props.nodes.includes(x));

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
          <Decription>Nodes {props.nodes.length}          </Decription>
        </Group>
      ) : (
        <Group>
          <Title>Group - {props.id}          </Title>
          <Decription>
Nodes
{' '}
{props.nodes.length}
{' '}
 </Decription>
        </Group>
      )}
    </div>
  );
}
