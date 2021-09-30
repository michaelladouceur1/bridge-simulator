import React, { useState, useContext } from "react";

import {
  RiArrowDropRightLine,
  RiArrowDropLeftLine,
  RiArrowDropDownLine,
  RiArrowDropUpLine,
} from "react-icons/ri";

import { ThemeContext } from "../../contexts/ThemeContext";

import { MainMenu } from "./main-menu/MainMenu";
import { SideMenu } from "./side-menu/SideMenu";
import { BottomMenu } from "./bottom-menu/BottomMenu";

import "./Menu.scss";

export const Menu = (props) => {
  const { isLight } = useContext(ThemeContext);

  const [sideMenuExpanded, setSideMenuExpanded] = useState(false);
  const [bottomMenuExpanded, setBottomMenuExpanded] = useState(false);
  const [selectedSubMenu, setSelectedSubMenu] = useState("bridge");

  return (
    <div
      className={`menu 
      ${sideMenuExpanded ? "side-expanded" : "side-collapsed"} 
      ${bottomMenuExpanded ? "bottom-expanded" : "bottom-collapsed"}
      ${isLight ? "dark" : "light"}`}
    >
      <div className="top-menu">
        <MainMenu selectedSubMenu={selectedSubMenu} />
        <SideMenu
          selectedSubMenu={selectedSubMenu}
          setSelectedSubMenu={setSelectedSubMenu}
          sideMenuExpanded={sideMenuExpanded}
        />
      </div>
      <BottomMenu bottomMenuExpanded={bottomMenuExpanded} />
      <div className="arrow side-arrow">
        {sideMenuExpanded ? (
          <RiArrowDropLeftLine onClick={() => setSideMenuExpanded(false)} />
        ) : (
          <RiArrowDropRightLine
            onClick={() => {
              setSideMenuExpanded(true);
              setBottomMenuExpanded(false);
            }}
          />
        )}
      </div>
      <div className="arrow bottom-arrow">
        {bottomMenuExpanded ? (
          <RiArrowDropUpLine onClick={() => setBottomMenuExpanded(false)} />
        ) : (
          <RiArrowDropDownLine
            onClick={() => {
              setBottomMenuExpanded(true);
              setSideMenuExpanded(false);
            }}
          />
        )}
      </div>
    </div>
  );
};
