import React, { createContext, useState } from "react";

export const ThemeContext = createContext(null);

export const ThemeContextProvider = ({ children }) => {
  const [isLight, setIsLight] = useState(true);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    element: undefined,
    x: 0,
    y: 0,
  });

  return (
    <ThemeContext.Provider
      value={{ isLight, setIsLight, contextMenu, setContextMenu }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
