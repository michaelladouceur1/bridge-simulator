import { useContext } from "react";

import { ElementsContext } from "../../contexts/ElementsContext";

import { Canvas } from "../common/canvas/Canvas";
import { Connection, Beam, Support, Force } from "./BridgeCanvasElements";

export const BridgeCanvas = () => {
  const {
    setElementType,
    connections,
    setConnections,
    beams,
    setBeams,
    supports,
    setSupports,
    forces,
    setForces,
    elementHover,
    pendingElement,
    setPendingElement,
  } = useContext(ElementsContext);

  const classes = [Connection, Beam, Support, Force];

  const elements = [connections, beams, supports, forces];

  const placements = {
    connection: {
      elements: connections,
      id: "C",
      action: ({ id, placementX, placementY, scale }) => {
        setConnections([
          ...connections,
          new Connection(id, placementX, placementY, scale),
        ]);
      },
    },
    beam: {
      elements: beams,
      id: "B",
      action: ({ id }) => {
        if (elementHover) {
          if (pendingElement) {
            if (pendingElement.id === elementHover.id) return;
            setBeams([...beams, new Beam(id, pendingElement, elementHover)]);
            setPendingElement(undefined);
          } else {
            setPendingElement(elementHover);
          }
        }
      },
    },
    support: {
      elements: supports,
      id: "S",
      action: ({ id, placementX, placementY, scale }) => {
        setSupports([
          ...supports,
          new Support(id, placementX, placementY, scale),
        ]);
      },
    },
    force: {
      elements: forces,
      id: "F",
      action: ({ id }) => {
        if (elementHover && elementHover.type === "connection") {
          setForces([...forces, new Force(id, elementHover)]);
        }
      },
    },
  };

  const keypressEventListeners = [
    {
      key: "c",
      action: () => setElementType("connection"),
    },
    {
      key: "b",
      action: () => setElementType("beam"),
    },
    {
      key: "s",
      action: () => setElementType("support"),
    },
    {
      key: "f",
      action: () => setElementType("force"),
    },
    {
      key: "d",
      action: () => {
        setConnections([]);
        setBeams([]);
        setSupports([]);
        setForces([]);
      },
    },
  ];

  return (
    <Canvas
      classes={classes}
      elements={elements}
      placements={placements}
      keypressEventListeners={keypressEventListeners}
    />
  );
};
