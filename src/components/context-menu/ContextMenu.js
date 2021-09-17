import React, { useState } from "react";
import { AiOutlineClose, AiFillLock, AiFillUnlock } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";

import { Button } from "../Button";

import "./ContextMenu.scss";

const contextMenuButtons = [
  {
    icon: <FaTrashAlt />,
    tooltip: "Lock Element",
  },
  {
    icon: <AiFillLock />,
    tooltip: "Unlock Element",
  },
  {
    icon: <AiFillUnlock />,
    tooltip: "Unlock Element",
  },
  {
    icon: <AiFillUnlock />,
    tooltip: "Unlock Element",
  },
  {
    icon: <AiFillUnlock />,
    tooltip: "Unlock Element",
  },
  {
    icon: <AiFillUnlock />,
    tooltip: "Unlock Element",
  },
  {
    icon: <AiFillUnlock />,
    tooltip: "Unlock Element",
  },
  {
    icon: <AiFillUnlock />,
    tooltip: "Unlock Element",
  },
];

const angle = 45;

export const ContextMenu = () => {
  const [contextMenuVisible, setContextMenuVisible] = useState(true);

  const calculateAngle = (idx) => {
    return angle * (idx - (contextMenuButtons.length - 1) / 2);
  };

  return (
    <div
      className={`context-menu-container ${contextMenuVisible ? "" : "hidden"}`}
    >
      <div className="context-menu">
        <Button
          width="60px"
          height="60px"
          tooltip="Close"
          onClick={() => setContextMenuVisible(false)}
        >
          <AiOutlineClose />
        </Button>
        {contextMenuButtons.map((button, idx) => {
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
                // tooltip={button.tooltip}
                style={{
                  transform: `rotate(${
                    -1 * calculateAngle(idx)
                  }deg) scale(0.75,0.75)`,
                }}
                width="40px"
                height="40px"
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
