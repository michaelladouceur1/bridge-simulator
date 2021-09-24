import { createContext, useState } from "react";

export const ActionsContext = createContext(null);

export const ActionsContextProvider = ({ children }) => {
  const [moveElement, setMoveElement] = useState(false);

  return (
    <ActionsContext.Provider value={{ moveElement, setMoveElement }}>
      {children}
    </ActionsContext.Provider>
  );
};
