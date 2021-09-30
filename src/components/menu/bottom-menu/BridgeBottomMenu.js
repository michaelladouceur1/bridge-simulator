import { useContext } from "react";

import { ElementsContext } from "../../../contexts/ElementsContext";

import { BottomMenuRow } from "./BottomMenuRow";

import "./BridgeBottomMenu.scss";

export const BridgeBottomMenu = () => {
  const { connections, supports, beams, forces } = useContext(ElementsContext);

  const elements = [...beams, ...connections, ...forces, ...supports];

  return (
    <div className="bottom-menu-content bridge-bottom-menu">
      {elements.length > 0 ? (
        elements.map((element) => {
          return <BottomMenuRow element={element} />;
        })
      ) : (
        <h3>Add elements to editor...</h3>
      )}
    </div>
  );
};
