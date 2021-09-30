import React, { useContext, useState } from "react";
import { BiRadioCircle } from "react-icons/bi";
import { GiSpawnNode } from "react-icons/gi";
import { AiOutlineLine } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { BsArrowBarDown, BsArrowBarRight, BsSun, BsMoon } from "react-icons/bs";
import { VscRunAll } from "react-icons/vsc";

import { ElementsContext } from "../../../contexts/ElementsContext";
import { ThemeContext } from "../../../contexts/ThemeContext";

import { Button } from "../../Button";

import "./BridgeMenu.scss";

export const BridgeMenu = (props) => {
  const {
    elementType,
    setElementType,
    setConnections,
    setBeams,
    setSupports,
    setForces,
  } = useContext(ElementsContext);

  const { isLight, setIsLight } = useContext(ThemeContext);

  const [activeButton, setActiveButton] = useState("connection");

  return (
    <div className="default-menu">
      <div className="elements">
        <Button
          className={elementType === "connection" ? "active" : ""}
          tooltip="Connection"
          onClick={() => {
            setElementType("connection");
          }}
        >
          <BiRadioCircle />
        </Button>
        <Button
          className={elementType === "beam" ? "active" : ""}
          tooltip="Beam"
          onClick={() => {
            setElementType("beam");
          }}
        >
          <AiOutlineLine />
        </Button>
        <Button
          className={elementType === "support" ? "active" : ""}
          tooltip="Support"
          onClick={() => {
            setElementType("support");
          }}
        >
          <GiSpawnNode />
        </Button>
        <Button
          className={elementType === "force" ? "active" : ""}
          tooltip="Vertical Force"
          onClick={() => {
            setElementType("force");
          }}
        >
          <BsArrowBarDown />
        </Button>
        <Button
          className={elementType === "horizontal-force" ? "active" : ""}
          tooltip="Horizontal Force"
          onClick={() => {
            setElementType("horizontal-force");
          }}
        >
          <BsArrowBarRight />
        </Button>
        <Button
          tooltip={isLight ? "Light Mode" : "Dark Mode"}
          onClick={() => setIsLight(!isLight)}
        >
          {isLight ? <BsSun /> : <BsMoon />}
        </Button>
      </div>
      <div className="edit">
        <Button
          tooltip="Clear"
          width="70px"
          onClick={() => {
            setConnections([]);
            setBeams([]);
            setSupports([]);
            setForces([]);
          }}
        >
          <FaTrashAlt style={{ fontSize: "1rem" }} />
        </Button>
        <Button tooltip="Run" width="70px">
          <VscRunAll style={{ fontSize: "1rem" }} />
        </Button>
      </div>
    </div>
  );
};
