import React, { useState, useContext } from "react";

import { ThemeContext } from "../contexts/ThemeContext";

import "./Button.scss";

export const Button = (props) => {
  const {
    className,
    tooltip,
    width = "40px",
    height = "40px",
    ...args
  } = props;

  const { isLight } = useContext(ThemeContext);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const buttonStyle = {
    width: width,
    height: height,
  };

  const tooltipStyle = {
    left: width,
    top: height,
  };

  return (
    <button
      className={`${className} ${isLight ? "dark" : "light"}`}
      onMouseOver={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
      style={buttonStyle}
      {...args}
    >
      <div
        className={`tooltip ${tooltipVisible ? "visible" : "hidden"}`}
        style={tooltipStyle}
      >
        {tooltip}
      </div>
      {props.children}
    </button>
  );
};
