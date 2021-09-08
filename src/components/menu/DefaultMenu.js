import React, { useContext } from "react";
import { BiRadioCircle } from "react-icons/bi";
import { GiSpawnNode } from "react-icons/gi";
import { AiOutlineLine } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";

import { ElementsContext } from "../../contexts/ElementsContext";

import { Button } from "../Button";

import "./DefaultMenu.scss";

export const DefaultMenu = (props) => {
  const { setConnections, setBeams } = useContext(ElementsContext);

  return (
    <div className="default-menu">
      <div className="elements">
        {/* <button>
          <BiRadioCircle />
        </button> */}
        <Button tooltip="Add Connection">
          <BiRadioCircle />
        </Button>
        <Button tooltip="Add Beam">
          <AiOutlineLine />
        </Button>
        <Button tooltip="Add Support">
          <GiSpawnNode />
        </Button>
      </div>
      <div className="edit">
        <Button
          tooltip="Clear"
          onClick={() => {
            setConnections([]);
            setBeams([]);
          }}
        >
          <FaTrashAlt />
        </Button>
      </div>
    </div>
  );
};
