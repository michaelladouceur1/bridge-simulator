import React, { createContext, useState } from "react";

export const ElementsContext = createContext(null);

export const ElementsContextProvider = ({ children }) => {
  const [alignments, setAlignments] = useState({ x: undefined, y: undefined });
  const [elementType, setElementType] = useState("connection");
  const [connections, setConnections] = useState([]);
  const [beams, setBeams] = useState([]);
  const [supports, setSupports] = useState([]);

  return (
    <ElementsContext.Provider
      value={{
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
      }}
    >
      {children}
    </ElementsContext.Provider>
  );
};
