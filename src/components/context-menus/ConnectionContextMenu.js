import { useContext } from "react";
import { AiFillLock } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { BsArrowsMove } from "react-icons/bs";

import { ElementsContext } from "../../contexts/ElementsContext";
import { ThemeContext } from "../../contexts/ThemeContext";

import { ContextMenu } from "../common/context-menu/ContextMenu";

export const ConnectionContextMenu = () => {
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
  const { contextMenu } = useContext(ThemeContext);

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

  return <ContextMenu buttons={buttons} />;
};
