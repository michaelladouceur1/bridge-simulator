import React, { useState, useLayoutEffect } from "react";

import "./Canvas.css";

const radius = 5;

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

function Alignment(element, mouse) {
  this.element = element;
  this.mouse = mouse;

  this.draw = function (ctx) {
    ctx.beginPath();
    ctx.moveTo(this.element.displayX, this.element.displayY);
    ctx.lineTo(this.mouse.x, this.mouse.y);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
  };
}

export const Canvas = (props) => {
  const { elementType } = props;

  const [mouse, setMouse] = useState({ x: undefined, y: undefined });
  const [connections, setConnections] = useState([]);
  const [beams, setBeams] = useState([]);
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

    const handleConnectionAlignment = () => {
      // Check if any connections on the screen coords align with the mouse coords
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
