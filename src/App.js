import React, { useState } from "react";

import { ThemeContextProvider } from "./contexts/ThemeContext";
import { ElementsContextProvider } from "./contexts/ElementsContext";
import { ActionsContextProvider } from "./contexts/ActionsContext";

import { Canvas } from "./components/Canvas";
import { Menu } from "./components/menu/Menu";
import { ConnectionContextMenu } from "./components/context-menus/ConnectionContextMenu";
import "./App.scss";

export const App = () => {
  return (
    <ActionsContextProvider>
      <ElementsContextProvider>
        <ThemeContextProvider>
          <Menu />
          <Canvas />
          <ConnectionContextMenu />
        </ThemeContextProvider>
      </ElementsContextProvider>
    </ActionsContextProvider>
  );
};
