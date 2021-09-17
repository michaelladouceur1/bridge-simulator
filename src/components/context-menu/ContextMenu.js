import React, { useState, useContext } from "react";
import { AiOutlineClose, AiFillLock, AiFillUnlock } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { BsArrowsMove } from "react-icons/bs";

import { ElementsContext } from "../../contexts/ElementsContext";
import { ThemeContext } from "../../contexts/ThemeContext";

import { Button } from "../Button";

import "./ContextMenu.scss";

const angle = 45;

export const ContextMenu = () => {
  const {
    setAlignments,
    elementType,
    connections,
    setConnections,
    beams,
    setBeams,
    supports,
    setSupports,
  } = useContext(ElementsContext);
  const { contextMenu, setContextMenu } = useContext(ThemeContext);

  const [tooltip, setTooltip] = useState(undefined);

  const contextMenuButtons = [
    {
      icon: <FaTrashAlt />,
      tooltip: "Delete",
      onClick: () => {
        const elementId = contextMenu.element.id;

        const deleteElement = (elementArray) => {
          const idx = elementArray.map((el) => el.id).indexOf(elementId);
          const elementArrayCopy = [...elementArray];
          elementArrayCopy.splice(idx, 1);
          setAlignments({ x: undefined, y: undefined });
          return elementArrayCopy;
        };

        // Delete beams associated with element
        const beamsCopy = [...beams];
        const filteredBeams = beamsCopy.filter(
          (beam) => beam.el1.id !== elementId && beam.el2.id !== elementId
        );
        setBeams(filteredBeams);

        // Delete connections
        if (contextMenu.element.type === "connection") {
          setConnections(deleteElement(connections));
        }

        // Delete supports
        else if (contextMenu.element.type === "support") {
          setSupports(deleteElement(supports));
        }
      },
    },
    {
      icon: <AiFillLock />,
      tooltip: "Lock",
    },
    {
      icon: <BsArrowsMove />,
      tooltip: "Move",
    },
  ];

  const calculateAngle = (idx) => {
    return angle * (idx - (contextMenuButtons.length - 1) / 2);
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
                style={{
                  transform: `rotate(${
                    -1 * calculateAngle(idx)
                  }deg) scale(0.75,0.75)`,
                }}
                width="40px"
                height="40px"
                onMouseEnter={() => setTooltip(button.tooltip)}
                onMouseLeave={() => setTooltip(undefined)}
                onClick={() => button.onClick()}
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
