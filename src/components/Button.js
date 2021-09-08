import React, { useState } from "react";

import "./Button.scss";

export const Button = (props) => {
  const { tooltip, width = "50px", height = "50px", ...args } = props;

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
