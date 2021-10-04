import React, { createContext, useState } from "react";

export const ElementsContext = createContext(null);

export const ElementsContextProvider = ({ children }) => {
  const [allElements, setAllElements] = useState([]);
  const [alignments, setAlignments] = useState({ x: undefined, y: undefined });
  const [elementType, setElementType] = useState(undefined);
  const [connections, setConnections] = useState([]);
  const [beams, setBeams] = useState([]);
  const [supports, setSupports] = useState([]);
  const [forces, setForces] = useState([]);
  const [elementHover, setElementHover] = useState(false);
  const [pendingElement, setPendingElement] = useState(undefined);
  const [moveElement, setMoveElement] = useState(false);

  const solve = () => {};

  const solveReactionForces = () => {
    if (supports.length >= 2 && forces.length > 0) {
      const sum = supports.map((support) => {
        return forces
          .map((force) => {
            const dist = support.x - force.element.x;
            return dist * force;
          })
          .reduce((acc, cv) => {
            return acc + cv;
          }, 0);
      });

      console.log(sum);
    }
  };

  const updateConnection = (callback, elementId) => {
    const connectionsCopy = [...connections];
    connectionsCopy.forEach((element) => {
      if (element.id === elementId) {
        callback();
      }
    });
    setConnections(connectionsCopy);
  };

  const updateSupport = (callback, elementId) => {
    const supportsCopy = [...supports];
    supportsCopy.forEach((element) => {
      if (element.id === elementId) {
        callback();
      }
    });
    setSupports(supportsCopy);
  };

  return (
    <ElementsContext.Provider
      value={{
        allElements,
        setAllElements,
        alignments,
        setAlignments,
        elementType,
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
        setElementHover,
        pendingElement,
        setPendingElement,
        moveElement,
        setMoveElement,
        updateConnection,
        updateSupport,
        solveReactionForces,
      }}
    >
      {children}
    </ElementsContext.Provider>
  );
};
