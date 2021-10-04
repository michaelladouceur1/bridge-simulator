import { useState, useContext } from "react";

import { AiFillLock } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";

import { ElementsContext } from "../../../contexts/ElementsContext";

import { Button } from "../../common/button/Button";

import "./BottomMenuRow.scss";

export const BottomMenuRow = (props) => {
  const { element } = props;

  const { updateConnection } = useContext(ElementsContext);

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
            type="number"
            onChange={(event) => {
              const elementId = element.id;
              const xValue = event.target.value;
              updateConnection(() => {
                element.x = Number(xValue);
              }, elementId);
            }}
          ></input>
        </div>
        <div>
          <label for="y-coord">Y</label>
          <input
            id="y-coord"
            value={element.y}
            type="number"
            onChange={(event) => {
              const elementId = element.id;
              const yValue = event.target.value;
              updateConnection(() => {
                element.y = Number(yValue);
              }, elementId);
            }}
          ></input>
        </div>
      </div>
    </div>
  );
};
