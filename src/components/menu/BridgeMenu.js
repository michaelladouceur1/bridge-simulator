import React, { useContext, useState } from "react";
import { BiRadioCircle } from "react-icons/bi";
import { GiSpawnNode } from "react-icons/gi";
import { AiOutlineLine } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { BsArrowBarDown, BsArrowBarRight, BsSun, BsMoon } from "react-icons/bs";
import { VscRunAll } from "react-icons/vsc";

import { ElementsContext } from "../../contexts/ElementsContext";
import { ThemeContext } from "../../contexts/ThemeContext";

import { Button } from "../Button";

import "./BridgeMenu.scss";

export const BridgeMenu = (props) => {
  const { setElementType, setConnections, setBeams, setSupports, setForces } =
    useContext(ElementsContext);

  const { isLight, setIsLight } = useContext(ThemeContext);

  const [activeButton, setActiveButton] = useState("connection");

  return (
    <div className="default-menu">
      <div className="elements">
        <Button
          className={activeButton === "connection" ? "active" : ""}
          tooltip="Connection"
          onClick={() => {
            setActiveButton("connection");
            setElementType("connection");
          }}
        >
          <BiRadioCircle />
        </Button>
        <Button
          className={activeButton === "beam" ? "active" : ""}
          tooltip="Beam"
          onClick={() => {
            setActiveButton("beam");
            setElementType("beam");
          }}
        >
          <AiOutlineLine />
        </Button>
        <Button
          className={activeButton === "support" ? "active" : ""}
          tooltip="Support"
          onClick={() => {
            setActiveButton("support");
            setElementType("support");
          }}
        >
          <GiSpawnNode />
        </Button>
        <Button
          className={activeButton === "force" ? "active" : ""}
          tooltip="Vertical Force"
          onClick={() => {
            setActiveButton("force");
            setElementType("force");
          }}
        >
          <BsArrowBarDown />
        </Button>
        <Button
          className={activeButton === "horizontal-force" ? "active" : ""}
          tooltip="Horizontal Force"
          onClick={() => {
            setActiveButton("horizontal-force");
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
