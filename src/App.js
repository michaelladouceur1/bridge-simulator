import React, { useState } from "react";

import { Canvas } from "./components/Canvas";
import { Menu } from "./components/Menu";
import "./App.css";

export const App = (props) => {
  const [elementType, setElementType] = useState("connection");

  return (
    <>
      <Menu setElementType={setElementType} />
      <Canvas elementType={elementType} />
    </>
  );
};
