import { useState, useContext } from "react";

import { AiFillLock } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";

import { ElementsContext } from "../../../contexts/ElementsContext";

import { Button } from "../../common/button/Button";

import "./BottomMenuRow.scss";

export const BottomMenuRow = (props) => {
  const { element } = props;

  const { connections, setConnections, supports, setSupports } =
    useContext(ElementsContext);

  const [rowExpanded, setRowExpanded] = useState(false);
  const [activeElement, setActiveElement] = useState(element);

  const updateConnections = (elementId, axis, value) => {
    const connectionsCopy = [...connections];
    connectionsCopy.forEach((element) => {
      if (element.id === elementId) {
        element[axis] = Number(value);
      }
    });
    setConnections(connectionsCopy);
  };

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
              updateConnections(elementId, "x", xValue);
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
              updateConnections(elementId, "y", yValue);
            }}
          ></input>
        </div>
      </div>
    </div>
  );
};
