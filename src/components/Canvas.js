import React, { useState, useLayoutEffect, useContext } from "react";
import { ElementsContext } from "../contexts/ElementsContext";

import "./Canvas.css";

// Parameters
const radius = 5;

// Connection element
function Connection(id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.displayX = x;
  this.displayY = y;
  this.radius = radius;

  this.draw = function (ctx) {
    ctx.beginPath();
    ctx.arc(this.displayX, this.displayY, this.radius, Math.PI * 2, false);
    ctx.fillStyle = "#141414";
    ctx.strokeStyle = "#b8b8b8";
    ctx.lineWidth = this.radius / 2;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  };

  this.scale = function (s) {
    const A = [
      [s, 0],
      [0, s],
    ];
    this.v = numeric.dot(A, this.v);
  };

  this.translate = function (xTranslate, yTranslate) {
    this.displayX += xTranslate;
    this.displayY += yTranslate;
  };
}

// Alignment element
function Alignment(element, mouse) {
  this.element = element;
  this.mouse = mouse;

  this.draw = function (ctx) {
    let xOffset = 0;
    let yOffset = 0;

    ctx.beginPath();
    if (this.element.displayX === this.mouse.x) {
      yOffset =
        this.element.displayY > this.mouse.y ? -(radius * 2) : radius * 2;
    } else {
      xOffset =
        this.element.displayX > this.mouse.x ? -(radius * 2) : radius * 2;
    }
    ctx.moveTo(
      this.element.displayX + xOffset,
      this.element.displayY + yOffset
    );
    ctx.lineTo(this.mouse.x, this.mouse.y);
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.closePath();
  };
}

export const Canvas = () => {
  const { elementType, connections, setConnections, beams, setBeams } =
    useContext(ElementsContext);

  const [mouse, setMouse] = useState({ x: undefined, y: undefined });
  const [alignments, setAlignments] = useState([]);
  const [elementHover, setElementHover] = useState(false);

  useLayoutEffect(() => {
    // Set canvas and context; Clear canvas for new render
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    // Draw connections
    if (connections.length > 0) {
      for (const connection of connections) {
        connection.draw(ctx);
      }
    }

    // Draw beams
    if (beams.length > 0) {
      for (const beam of beams) {
        beam.draw(ctx);
      }
    }

    // Draw alignments
    if (alignments.length > 0) {
      for (const alignment of alignments) {
        alignment.draw(ctx);
      }
    }
  }, [connections, beams, alignments]);

  const handleMouseMove = (event) => {
    // Set mouse object coordinates
    const { clientX, clientY } = event;
    setMouse({ x: clientX, y: clientY });

    // Check if the mouse is hovering over the same position as a connection element
    const handleElementHover = () => {
      // Initialize hovered function for checking if the mouse is hovered over a connection element
      const hovered = (el) => {
        const hoveredRadius = Math.sqrt(
          Math.pow(el.displayX - mouse.x, 2) +
            Math.pow(el.displayY - mouse.y, 2)
        );

        return hoveredRadius < radius;
      };

      // Set elementHover to result of Array.some(hovered) check
      setElementHover(connections.some(hovered));
    };

    // Check if the mouse coords align with any of the connection elements coords
    const handleConnectionAlignment = () => {
      for (const connection of connections) {
        // Find if checked connection exists in alignments
        const alignmentConnection = alignments.find(
          (al) => al.element.id === connection.id
        );

        // Connection and mouse coords align
        // Add connection to alignments if it does not already exist in alignments
        if (
          mouse.x === connection.displayX ||
          mouse.y === connection.displayY
        ) {
          if (!alignmentConnection) {
            setAlignments([...alignments, new Alignment(connection, mouse)]);
          }
        }

        // Connection and mouse coords do not align
        // Remove from alignments if connection exists in alignments
        else {
          if (alignmentConnection) {
            const alignmentsCopy = [...alignments];
            const index = alignmentsCopy.find((al, idx) => {
              if (al.element.id === connection.id) return idx;
            });
            alignmentsCopy.splice(index, 1);
            setAlignments(alignmentsCopy);
          }
        }
      }
    };

    handleElementHover();
    handleConnectionAlignment();
  };

  const handleClick = () => {
    const connectionId = connections.length + 1;
    setConnections([
      ...connections,
      new Connection(connectionId, mouse.x, mouse.y),
    ]);
  };

  return (
    <canvas
      className={elementHover ? "hovered" : ""}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    />
  );
};
