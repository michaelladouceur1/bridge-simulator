import React, { createContext, useState } from "react";

export const ElementsContext = createContext(null);

export const ElementsContextProvider = ({ children }) => {
  const [elementType, setElementType] = useState("connection");
  const [connections, setConnections] = useState([]);
  const [beams, setBeams] = useState([]);

  return (
    <ElementsContext.Provider
      value={{
        elementType,
        setElementType,
        connections,
        setConnections,
        beams,
        setBeams,
      }}
    >
      {children}
    </ElementsContext.Provider>
  );
};
