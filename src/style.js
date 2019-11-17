import React from "react";
import styled from "styled-components";

export const HideMenu = styled.button`
  background: white;
`;

export const SideBar = styled.div`
  font-family: "Open Sans", Helvetica, sans-serif;
  background: #1d2026;
  z-index: 1;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 20vw;

  @media only screen and (max-width: 1000px) {
    width: 35vw;
  }

  @media only screen and (max-width: 700px) {
    width: 50vw;
  }
`;

export const SettingsButton = styled.button`
  display: inline-block;
  margin-left: 2em;
  margin-right: 2em;
  padding: 0.5em;
  background-color: #3c5da1;
  border-style: none;
  margin: 0.5em;
  color: white;
  font-weight: 700;
  font-family: "Open Sans", Helvetica, sans-serif;
  text-transform: uppercase;
  font-size: 0.85em;
  opacity: 1;
  transition: 0.3s;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  :hover {
    opacity: 0.8;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const HorizontalLine = styled.hr`
  width: 75%;
  border-top: 1px solid #8c8b8b;
  margin-top: 1em;
  margin-bottom: 1em;
`;

export const SettingsSelect = styled.select``;

export const SettingsInput = styled.input`
  display: flex;
`;

export const SettingsTitle = styled.h1`
  margin-bottom: 0;
  margin-top: 0;
  text-transform: uppercase;
  text-align: center;
  font-size: 1.5em;
  font-weight: bold;

  padding: 5px;
`;

export const SettingsSubTitle = styled.h2`
  margin-bottom: 0;
  font-size: 1em;
  font-weight: bold;

  padding-top: 5px;
  padding-bottom: 5px;
`;

export const SettingsSubMenu = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-left: 2em;
  margin-right: 2em;

  @media only screen and (max-width: 1000px) {
    margin-left: 0;
    margin-right: 0;
  }
}  
`;

export const ToggleButton = styled.button`
height: 7em;
flex:auto;
background-color:#1d2026;
border-style: none;
`;

export const Test = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  & > * {
    margin: 0.3em;
  }

  padding-left: 2em;
  padding-right: 2em;
`;

export function SettingsInputCheckbox(props) {
  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>
      <SettingsInput ref={props.value} type="checkbox" />
      <SettingsSubTitle>{props.text}</SettingsSubTitle>
    </div>
  );
}

export function SettingsInputRange(props) {
  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>
      <SettingsInput
        type="range"
        min={props.min}
        max={props.max}
        value={props.value}
        step={props.step}
      />
      <SettingsSubTitle>{props.text}</SettingsSubTitle>
    </div>
  );
}
