import React, { useState } from "react";

import { ThemeContextProvider } from "./contexts/ThemeContext";
import { ElementsContextProvider } from "./contexts/ElementsContext";

import { Canvas } from "./components/Canvas";
import { Menu } from "./components/menu/Menu";
import "./App.css";

export const App = () => {
  return (
    <ElementsContextProvider>
      <ThemeContextProvider>
        <Menu />
        <Canvas />
      </ThemeContextProvider>
    </ElementsContextProvider>
  );
};
