import { useState } from "react";

import { AiFillLock } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";

import { Button } from "../../Button";

import "./BottomMenuRow.scss";

export const BottomMenuRow = (props) => {
  const { element } = props;

  const [rowExpanded, setRowExpanded] = useState(false);
  const [activeElement, setActiveElement] = useState(element);

  const capitalize = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="bottom-menu-content-row">
      <div
        className="bottom-menu-content-row-top"
        onClick={() => setRowExpanded(!rowExpanded)}
      >
        <p>{element.id}</p>
        <p>{capitalize(element.type)}</p>
      </div>
      <div
        className={`bottom-menu-content-row-bottom ${
          rowExpanded ? "expanded" : "collapsed"
        }`}
      >
        <div>
          <label for="x-coord">X</label>
          <input
            id="x-coord"
            value={element.x}
            onChange={(event) => {
              const value = Number(event.target.value);
              const el = { ...activeElement };
              el.x = value;
              console.log(el);
              setActiveElement(el);
            }}
          ></input>
        </div>
        <div>
          <label for="y-coord">Y</label>
          <input
            id="y-coord"
            value={element.y}
            onChange={(event) => {
              const value = Number(event.target.value);
              const el = { ...activeElement };
              el.x = value;
              console.log(el);
              setActiveElement(el);
            }}
          ></input>
        </div>
      </div>
    </div>
  );
};
