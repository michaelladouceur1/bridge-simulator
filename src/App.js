import React, { useState } from "react";

import { ThemeContextProvider } from "./contexts/ThemeContext";
import { ElementsContextProvider } from "./contexts/ElementsContext";

import { Canvas } from "./components/Canvas";
import { Menu } from "./components/menu/Menu";
import { ConnectionContextMenu } from "./components/context-menus/ConnectionContextMenu";
import "./App.scss";

export const App = () => {
  return (
    <ElementsContextProvider>
      <ThemeContextProvider>
        <Menu />
        <Canvas />
        <ConnectionContextMenu />
      </ThemeContextProvider>
    </ElementsContextProvider>
  );
};
