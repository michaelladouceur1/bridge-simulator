import React, { useState, useLayoutEffect, useContext, useEffect } from "react";
import { ElementsContext } from "../contexts/ElementsContext";
import { ThemeContext } from "../contexts/ThemeContext";

import "./Canvas.scss";

// Parameters
const radius = 6;

// Connection element
function Connection(id, x, y, scale) {
  this.id = id;
  this.x = x / scale;
  this.y = y / scale;
  this.radius = radius;

  this.draw = function (ctx) {
    this.path = new Path2D();
    ctx.beginPath();
    this.path.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    ctx.fillStyle = "#141414";
    ctx.strokeStyle = "#949494";
    ctx.lineWidth = this.radius / 3;
    ctx.fill(this.path);
    ctx.stroke(this.path);
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

function Beam(id, el1, el2, scale) {
  this.id = id;
  this.el1 = el1;
  this.el2 = el2;

  this.draw = function (ctx) {
    ctx.fillStyle = "#949494";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(el1.x, el1.y);
    ctx.lineTo(el2.x, el2.y);
    ctx.closePath();
  };
}

// Support element
function Support(id, x, y, scale) {
  this.id = id;
  this.x = x / scale;
  this.y = y / scale;

  this.draw = function (ctx) {
    ctx.fillStyle = "#949494";
    ctx.lineWidth = 1;
    let p1 = new Path2D();
    p1.rect(0, 0, 0, 0);
    let p2 = new Path2D(
      "M 12 12 L 6 12 L 3 9 L -3 9 L -6 12 L -12 12 L -6 -3 C -3 -9 3 -9 6 -3 L 12 12 M -3 0 A 3 3 90 0 0 3 0 A 3 3 90 0 0 -3 0"
    );
    let m = new DOMMatrix();
    m.a = 1;
    m.b = 0;
    m.c = 0;
    m.d = 1;
    m.e = this.x;
    m.f = this.y;
    p1.addPath(p2, m);
    ctx.stroke(p1);
    ctx.fill(p1);
  };
}

// Alignment element
function Alignment(element, mouse, prox) {
  this.element = element;
  this.mouse = mouse;

  this.draw = function (ctx) {
    let xOffset = 0;
    let yOffset = 0;

    ctx.beginPath();
    if (
      this.mouse.transformed.x > this.element.x - prox &&
      this.mouse.transformed.x < this.element.x + prox
    ) {
      yOffset =
        this.element.y > this.mouse.transformed.y ? -(radius * 2) : radius * 2;
    } else {
      xOffset =
        this.element.x > this.mouse.transformed.x ? -(radius * 2) : radius * 2;
    }
    ctx.moveTo(this.element.x + xOffset, this.element.y + yOffset);
    if (yOffset === 0) {
      ctx.lineTo(this.mouse.transformed.x, this.element.y);
    } else {
      ctx.lineTo(this.element.x, this.mouse.transformed.y);
    }
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.closePath();
  };

  this.update = function () {};
}

export const Canvas = () => {
  const {
    elementType,
    connections,
    setConnections,
    beams,
    setBeams,
    supports,
    setSupports,
  } = useContext(ElementsContext);

  const { isLight } = useContext(ThemeContext);

  const [mouseDown, setMouseDown] = useState(false);
  const [cssClasses, setCssClasses] = useState("");
  const [mouse, setMouse] = useState({ x: undefined, y: undefined });
  const [alignments, setAlignments] = useState([]);
  const [elementHover, setElementHover] = useState(false);

  useEffect(() => {
    const classes = [
      {
        value: elementHover,
        classTrue: "hovered",
        classFalse: "",
      },
      {
        value: isLight,
        classTrue: "dark",
        classFalse: "light",
      },
    ];

    const classesString = classes
      .map((obj) => {
        return obj.value === true ? obj.classTrue : obj.classFalse;
      })
      .join(" ");

    setCssClasses(classesString);
  }, [elementHover, isLight]);

  useLayoutEffect(() => {
    drawElements();
  }, [connections, beams, supports, alignments]);

  const drawElements = () => {
    // Set canvas and context; Clear canvas for new render
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    // console.log(ctx);
    // console.log(ctx.getTransform());
    // console.log(connections);
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

    // Draw Supports
    if (supports.length > 0) {
      for (const support of supports) {
        support.draw(ctx);
      }
    }

    // Draw alignments
    if (alignments.length > 0) {
      for (const alignment of alignments) {
        alignment.draw(ctx);
      }
    }
  };

  const handleMouseDown = (event) => {
    // console.log(event);
    // console.log(window);
    // console.log("handleMouseDown");
    setMouseDown(true);
  };

  const handleMouseUp = () => {
    // console.log("handleMouseUp");
    setMouseDown(false);
  };

  let count = 0;

  const handleMouseMove = (event) => {
    // Set mouse object coordinates
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    const { clientX, clientY } = event;
    const { a, e: xOffset, f: yOffset } = ctx.getTransform();

    setMouse({
      transformed: {
        x: clientX - xOffset,
        y: clientY - yOffset,
      },
      original: {
        x: clientX,
        y: clientY,
      },
    });

    // if (count % 100 === 0) {
    //   console.log(mouse);
    //   console.log(connections);
    //   console.log("\n\n\n");
    // }
    // count++;

    // Check if the mouse is hovering over the same position as a connection element
    const handleElementHover = () => {
      // Initialize hovered function for checking if the mouse is hovered over a connection element
      const hovered = (el) => {
        if (ctx.isPointInPath(el.path, mouse.original.x, mouse.original.y)) {
          return true;
        }
      };

      // Set elementHover to result of Array.some(hovered) check
      setElementHover(connections.some(hovered));
    };

    // Check if the mouse coords align with any of the connection elements coords
    const handleConnectionAlignment = () => {
      for (const element of [...connections, ...supports]) {
        // Find if checked connection exists in alignments
        const alignmentConnection = alignments.find(
          (al) => al.element.id === element.id
        );

        // Connection and mouse coords align
        // Add connection to alignments if it does not already exist in alignments
        const prox = 10;

        // Check if vertical alignment band is valid
        if (
          (mouse.transformed.x > element.x - prox &&
            mouse.transformed.x < element.x + prox) ||
          (mouse.transformed.y > element.y - prox &&
            mouse.transformed.y < element.y + prox)
        ) {
          // console.log(alignments);
          if (!alignmentConnection) {
            // console.log("alignment not found");
            setAlignments([...alignments, new Alignment(element, mouse, prox)]);
          } else if (alignmentConnection.element.y !== mouse.transformed.y) {
            const alignmentsCopy = [...alignments];
            const index = alignmentsCopy.find((al, idx) => {
              if (al.element.id === element.id) return idx;
            });
            alignmentsCopy.splice(
              index,
              1,
              new Alignment(element, mouse, prox)
            );
            setAlignments(alignmentsCopy);
          }
        }

        // todo: horizontal and vertical check can be implemented in the same logic, but some issues still exist
        // Check if horizontal alignment band is valid
        // else if (mouse.transformed.y > element.y - prox && mouse.transformed.y < element.y + prox) {
        //   if (!alignmentConnection) {
        //     setAlignments([...alignments, new Alignment(element, mouse, prox)]);
        //   } else if (alignmentConnection.element.x !== mouse.transformed.x) {
        //     const alignmentsCopy = [...alignments];
        //     const index = alignmentsCopy.find((al, idx) => {
        //       if (al.element.id === element.id) return idx;
        //     });
        //     alignmentsCopy.splice(
        //       index,
        //       1,
        //       new Alignment(element, mouse, prox)
        //     );
        //     setAlignments(alignmentsCopy);
        //   }
        // }

        // Connection and mouse coords do not align
        // Remove from alignments if connection exists in alignments
        else {
          if (alignmentConnection) {
            const alignmentsCopy = [...alignments];
            const index = alignmentsCopy.find((al, idx) => {
              if (al.element.id === element.id) return idx;
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
    // todo; The border limiting doesn't work when zoomed out currently.
    // Check if the click was too close to the edges
    // Bug where the elements are being drawn multiple times on zoom
    // const border = 10;
    // if (
    //   mouse.transformed.x < border ||
    //   mouse.transformed.y < border ||
    //   mouse.transformed.x > window.innerWidth - border ||
    //   mouse.transformed.y > window.innerHeight - border
    // ) {
    //   return;
    // }

    // Create context and get transform for scale factor
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const { a: scale } = ctx.getTransform();

    // Create new Connection element
    const handleConnectionClick = () => {
      const connectionId = `${connections.length + 1}C`;
      setConnections([
        ...connections,
        new Connection(
          connectionId,
          mouse.transformed.x,
          mouse.transformed.y,
          scale
        ),
      ]);
    };

    const handleBeamClick = () => {};

    // Create new Support element
    const handleSupportClick = () => {
      const supportId = `${supports.length + 1}S`;
      setSupports([
        ...supports,
        new Support(supportId, mouse.transformed.x, mouse.transformed.y, scale),
      ]);
    };

    if (elementType === "connection") handleConnectionClick();
    else if (elementType === "support") handleSupportClick();
  };

  const handleWheel = (event) => {
    const scaleFactor = 0.1;
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const { a } = ctx.getTransform();

    if (event.deltaY < 0 && a < 2) {
      ctx.translate(mouse.transformed.x, mouse.transformed.y);
      ctx.scale(1 + scaleFactor, 1 + scaleFactor);
      ctx.translate(-mouse.transformed.x, -mouse.transformed.y);
    } else if (event.deltaY > 0 && a > 0.5) {
      ctx.translate(mouse.transformed.x, mouse.transformed.y);
      ctx.scale(1 - scaleFactor, 1 - scaleFactor);
      ctx.translate(-mouse.transformed.x, -mouse.transformed.y);
    }

    drawElements();
  };

  const handleAuxClick = (event) => {
    console.log(mouse);
    console.log(connections);
    console.log("\n\n\n");
  };

  return (
    <canvas
      className={cssClasses}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      // onWheel={handleWheel}
      onAuxClick={handleAuxClick}
    />
  );
};
