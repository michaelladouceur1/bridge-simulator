import React from "react";

export const SideMenu = (props) => {
  const { sideMenuExpanded } = props;

  return (
    <div
      className={`side-menu ${
        sideMenuExpanded ? "side-expanded" : "side-collapsed"
      }`}
    >
      <button>1</button>
      <button>2</button>
      <button>3</button>
      <button>4</button>
      <button>5</button>
    </div>
  );
};
