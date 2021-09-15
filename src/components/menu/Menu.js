import React, { useState, useContext } from "react";
import {
  BiRightArrow,
  BiLeftArrow,
  BiDownArrow,
  BiUpArrow,
} from "react-icons/bi";

import { ThemeContext } from "../../contexts/ThemeContext";

import { MainMenu } from "./MainMenu";
import { SideMenu } from "./SideMenu";
import { BottomMenu } from "./BottomMenu";

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
      <BottomMenu />
      <div className="arrow side-arrow">
        {sideMenuExpanded ? (
          <BiLeftArrow onClick={() => setSideMenuExpanded(false)} />
        ) : (
          <BiRightArrow
            onClick={() => {
              setSideMenuExpanded(true);
              setBottomMenuExpanded(false);
            }}
          />
        )}
      </div>
      <div className="arrow bottom-arrow">
        {bottomMenuExpanded ? (
          <BiUpArrow onClick={() => setBottomMenuExpanded(false)} />
        ) : (
          <BiDownArrow
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
