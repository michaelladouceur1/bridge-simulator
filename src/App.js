import React, { useState } from "react";

import { ThemeContextProvider } from "./contexts/ThemeContext";
import { ElementsContextProvider } from "./contexts/ElementsContext";

import { Canvas } from "./components/Canvas";
import { Menu } from "./components/menu/Menu";
import { ContextMenu } from "./components/context-menu/ContextMenu";
import "./App.scss";

export const App = () => {
  return (
    <ElementsContextProvider>
      <ThemeContextProvider>
        <Menu />
        <Canvas />
        <ContextMenu />
      </ThemeContextProvider>
    </ElementsContextProvider>
  );
};
