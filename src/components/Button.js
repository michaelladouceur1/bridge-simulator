import React, { useState } from "react";

import "./Button.scss";

export const Button = (props) => {
  const { tooltip, width = "40px", height = "40px", ...args } = props;

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const buttonStyle = {
    width: width,
    height: height,
    // fontSize: "18px",
    // fill: "18px",
  };

  const tooltipStyle = {
    left: width,
    top: height,
  };

  return (
    <button
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
