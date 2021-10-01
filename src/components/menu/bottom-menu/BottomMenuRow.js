import { useState, useContext } from "react";

import { AiFillLock } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";

import { ElementsContext } from "../../../contexts/ElementsContext";

import { Button } from "../../common/button/Button";

import "./BottomMenuRow.scss";

export const BottomMenuRow = (props) => {
  const { element } = props;

  const { connections, setConnections } = useContext(ElementsContext);

  const [rowExpanded, setRowExpanded] = useState(false);
  const [activeElement, setActiveElement] = useState(element);

  const updateConnections = (element) => {
    const connectionsCopy = [...connections];
    const filteredConnectionsCopy = connectionsCopy.filter(
      (el) => el.id !== element.id
    );
    const finalConnections = [...filteredConnectionsCopy, element].sort(
      (a, b) => {
        if (a.id > b.id) return 1;
        else return -1;
      }
    );
    console.log(connections);
    setConnections(finalConnections);
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
            onChange={(event) => {
              const elementCopy = { ...element };
              elementCopy.x = Number(event.target.value);
              updateConnections(elementCopy);
              // const value = Number(event.target.value);
              // const el = { ...activeElement };
              // element.x = value;
              // console.log(el);
              // setActiveElement(el);
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
