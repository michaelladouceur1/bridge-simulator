import React, { useState, useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";

import { ThemeContext } from "../../../contexts/ThemeContext";

import { Button } from "../button/Button";

import "./ContextMenu.scss";

const angle = 45;

export const ContextMenu = ({ buttons, ...args }) => {
  const { contextMenu, setContextMenu } = useContext(ThemeContext);
  const [tooltip, setTooltip] = useState(undefined);

  const calculateAngle = (idx) => {
    return angle * (idx - (buttons.length - 1) / 2);
  };

  return (
    <div
      className={`context-menu-container ${
        contextMenu.visible ? "" : "hidden"
      }`}
      style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
    >
      <div className="context-menu">
        <Button
          width="60px"
          height="60px"
          tooltip="Close"
          onClick={() => {
            const contextMenuCopy = { ...contextMenu };
            contextMenuCopy.visible = false;
            setContextMenu(contextMenuCopy);
          }}
        >
          {tooltip ? tooltip : <AiOutlineClose />}
        </Button>
        {buttons.map((button, idx) => {
          const level = Math.floor(idx / (360 / angle));
          return (
            <div
              className="outer-button-container"
              style={{
                transform: `rotate(${calculateAngle(idx)}deg)`,
              }}
            >
              <Button
                className="outer-button"
                style={{
                  transform: `rotate(${
                    -1 * calculateAngle(idx)
                  }deg) scale(0.75,0.75)`,
                }}
                width="40px"
                height="40px"
                onMouseEnter={() => setTooltip(button.tooltip)}
                onMouseLeave={() => setTooltip(undefined)}
                onClick={button.onClick ? () => button.onClick() : null}
                onMouseDown={
                  button.onMouseDown ? () => button.onMouseDown() : null
                }
                onMouseUp={button.onMouseUp ? () => button.onMouseUp() : null}
              >
                {button.icon}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
