import React, { useState } from "react";
import { BiRadioCircle } from "react-icons/bi";
import { MdSettings, MdAccountBox } from "react-icons/md";
import { GiArchBridge } from "react-icons/gi";

import { Button } from "../../common/button/Button";

import "./SideMenu.scss";

export const SideMenu = (props) => {
  const { sideMenuExpanded, selectedSubMenu, setSelectedSubMenu } = props;

  return (
    <div
      className={`side-menu ${
        sideMenuExpanded ? "side-expanded" : "side-collapsed"
      }`}
    >
      <Button
        className={selectedSubMenu === "bridge" ? "active" : ""}
        tooltip="Bridge Simulator"
        height="35px"
        onClick={() => setSelectedSubMenu("bridge")}
      >
        <GiArchBridge />
      </Button>
      <Button
        className={selectedSubMenu === "account" ? "active" : ""}
        tooltip="Account"
        height="35px"
        onClick={() => setSelectedSubMenu("account")}
      >
        <MdAccountBox />
      </Button>
      <Button
        className={selectedSubMenu === "settings" ? "active" : ""}
        tooltip="Settings"
        height="35px"
        onClick={() => setSelectedSubMenu("settings")}
      >
        <MdSettings />
      </Button>
    </div>
  );
};
