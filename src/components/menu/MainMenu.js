import React from "react";

import { BridgeMenu } from "./BridgeMenu";
import { AccountMenu } from "./AccountMenu";
import { SettingsMenu } from "./SettingsMenu";

export const MainMenu = (props) => {
  const { selectedSubMenu } = props;

  const menus = {
    bridge: <BridgeMenu />,
    account: <AccountMenu />,
    settings: <SettingsMenu />,
  };

  return <div className="main-menu">{menus[selectedSubMenu]}</div>;
};
