import React, { useState } from "react";
import { BiRadioCircle } from "react-icons/bi";
import { MdSettings, MdAccountBox } from "react-icons/md";
import { GiArchBridge } from "react-icons/gi";

import { Button } from "../Button";

import "./SideMenu.scss";

export const SideMenu = (props) => {
  const { sideMenuExpanded } = props;

  const [activeButton, setActiveButton] = useState("bridge");

  return (
    <div
      className={`side-menu ${
        sideMenuExpanded ? "side-expanded" : "side-collapsed"
      }`}
    >
      {/* <button>1</button>
      <button>2</button>
      <button>3</button>
      <button>4</button>
      <button>5</button> */}
      <Button
        className={activeButton === "bridge" ? "active" : ""}
        tooltip="Bridge Simulator"
        height="35px"
        onClick={() => setActiveButton("bridge")}
      >
        <GiArchBridge />
      </Button>
      <Button
        className={activeButton === "account" ? "active" : ""}
        tooltip="Account"
        height="35px"
        onClick={() => setActiveButton("account")}
      >
        <MdAccountBox />
      </Button>
      <Button
        className={activeButton === "settings" ? "active" : ""}
        tooltip="Settings"
        height="35px"
        onClick={() => setActiveButton("settings")}
      >
        <MdSettings />
      </Button>
    </div>
  );
};
