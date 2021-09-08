import React, { useState, useContext } from "react";
import {
  BiRightArrow,
  BiLeftArrow,
  BiDownArrow,
  BiUpArrow,
} from "react-icons/bi";

import { MainMenu } from "./MainMenu";
import { SideMenu } from "./SideMenu";
import { BottomMenu } from "./BottomMenu";

import "./Menu.scss";

export const Menu = (props) => {
  const [sideMenuExpanded, setSideMenuExpanded] = useState(false);
  const [bottomMenuExpanded, setBottomMenuExpanded] = useState(false);

  return (
    <div
      className={`menu 
      ${sideMenuExpanded ? "side-expanded" : "side-collapsed"} 
      ${bottomMenuExpanded ? "bottom-expanded" : "bottom-collapsed"}`}
    >
      <div className="top-menu">
        <MainMenu />
        <SideMenu sideMenuExpanded={sideMenuExpanded} />
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
