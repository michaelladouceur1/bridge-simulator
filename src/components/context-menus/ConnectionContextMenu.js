import { useContext } from "react";
import { AiFillLock } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { BsArrowsMove } from "react-icons/bs";

import { ElementsContext } from "../../contexts/ElementsContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ActionsContext } from "../../contexts/ActionsContext";

import { ContextMenu } from "../common/context-menu/ContextMenu";

export const ConnectionContextMenu = () => {
  const {
    setAlignments,
    setElementType,
    connections,
    setConnections,
    beams,
    setBeams,
    supports,
    setSupports,
    forces,
    setForces,
    setMoveElement,
  } = useContext(ElementsContext);

  const { contextMenu, setContextMenu } = useContext(ThemeContext);

  const buttons = [
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
        const filteredBeams = beamsCopy.filter((beam) => {
          return beam.el1.id !== elementId && beam.el2.id !== elementId;
        });
        setBeams(filteredBeams);

        // Delete forces associated with element
        const forcesCopy = [...forces];
        const filteredForces = forcesCopy.filter((force) => {
          return force.element.id !== elementId;
        });
        setForces(filteredForces);

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
      onClick: () => {
        const contextMenuCopy = { ...contextMenu };
        contextMenuCopy.element.locked = true;
        setContextMenu(contextMenuCopy);
      },
    },
    {
      icon: <BsArrowsMove />,
      tooltip: "Move",
      onMouseDown: () => {
        const contextMenuCopy = { ...contextMenu };
        contextMenuCopy.visible = false;
        setContextMenu(contextMenuCopy);
        setMoveElement(contextMenu.element);
        setElementType(undefined);
      },
    },
  ];

  return <ContextMenu buttons={buttons} />;
};
