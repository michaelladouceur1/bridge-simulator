import React, { useContext } from "react";

import { ElementsContext } from "../../contexts/ElementsContext";

import { BiRadioCircle } from "react-icons/bi";
import { GiSpawnNode } from "react-icons/gi";
import { AiOutlineLine } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";

import "./DefaultMenu.scss";

export const DefaultMenu = (props) => {
  const { setConnections, setBeams } = useContext(ElementsContext);

  return (
    <div className="default-menu">
      <div className="elements">
        <button>
          <BiRadioCircle />
        </button>
        <button>
          <AiOutlineLine />
        </button>
        <button>
          <GiSpawnNode />
        </button>
      </div>
      <div className="edit">
        <button
          onClick={() => {
            setConnections([]);
            setBeams([]);
          }}
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};
