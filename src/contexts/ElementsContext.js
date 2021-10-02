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
      }}
    >
      {children}
    </ElementsContext.Provider>
  );
};
