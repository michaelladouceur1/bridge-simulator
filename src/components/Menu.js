import React from "react";

import { BiRadioCircle } from "react-icons/bi";

import "./Menu.css";

export const Menu = (props) => {
  const { setElementType } = props;

  return (
    <div className="menu">
      <button id="connection-button">
        <BiRadioCircle fontSize="30px" />
      </button>
    </div>
  );
};
