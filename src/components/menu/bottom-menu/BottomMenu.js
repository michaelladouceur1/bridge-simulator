import React from "react";

import { BridgeBottomMenu } from "./BridgeBottomMenu";

import "./BottomMenu.scss";

export const BottomMenu = (props) => {
  const { bottomMenuExpanded } = props;

  return (
    <div className="bottom-menu">
      {bottomMenuExpanded ? <BridgeBottomMenu /> : <></>}
    </div>
  );
};
