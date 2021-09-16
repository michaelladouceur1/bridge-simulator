import React, { useState, useLayoutEffect, useContext, useEffect } from "react";
import { ElementsContext } from "../contexts/ElementsContext";
import { ThemeContext } from "../contexts/ThemeContext";

import "./Canvas.scss";

// Parameters
const radius = 6;

// Connection element
function Connection(id, x, y, scale) {
  this.id = id;
  this.type = "connection";
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

function Beam(id, el1, el2) {
  console.log("BEAM CREATED");
  console.log(el1);
  console.log(el2);
  this.id = id;
  this.type = "beam";
  this.el1 = el1;
  this.el2 = el2;

  this.draw = function (ctx) {
    ctx.fillStyle = "white";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(el1.x, el1.y);
    ctx.lineTo(el2.x, el2.y);
    ctx.stroke();
    ctx.closePath();
  };
}

// Support element
function Support(id, x, y, scale) {
  this.id = id;
  this.type = "support";
  this.x = x / scale;
  this.y = y / scale;

  this.draw = function (ctx) {
    ctx.fillStyle = "#949494";
    ctx.lineWidth = 1;
    this.path = new Path2D();
    this.path.rect(0, 0, 0, 0);
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
    this.path.addPath(p2, m);
    ctx.stroke(this.path);
    ctx.fill(this.path);
  };
}

// Alignment element
function Alignment(element, mouse, prox) {
  this.element = element;
  this.mouse = mouse;

  this.draw = function (ctx) {
    console.log("align draw");
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
  const [pendingElement, setPendingElement] = useState(undefined);
  const [cssClasses, setCssClasses] = useState("");
  const [mouse, setMouse] = useState({ x: undefined, y: undefined });
  // The following should be used: alignments = {x: undefined, y: undefined}
  const [alignments, setAlignments] = useState({ x: undefined, y: undefined });
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
        return obj.value || obj.value === true ? obj.classTrue : obj.classFalse;
      })
      .join(" ");

    setCssClasses(classesString);
  }, [elementHover, isLight]);

  useLayoutEffect(() => {
    // Combine all rendered elements
    const elements = [...connections, ...beams, ...supports];

    // Set canvas and context; Clear canvas for new render
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    // Render elements
    for (const el of elements) {
      el.draw(ctx);
    }

    console.log(alignments.x);
    console.log(alignments.y);

    if (alignments.x) {
      console.log("draw x: ", alignments.x);
      alignments.x.draw(ctx);
    }
    if (alignments.y) {
      console.log("draw y: ", alignments.y);
      alignments.y.draw(ctx);
    }
  }, [connections, beams, supports, alignments]);

  const handleMouseDown = (event) => {
    setMouseDown(true);
  };

  const handleMouseUp = () => {
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

    // console.log(alignments);

    // Check if the mouse is hovering over the same position as a connection element
    const handleElementHover = () => {
      // Initialize hovered function for checking if the mouse is hovered over a connection element
      let element = undefined;
      const hovered = (el) => {
        if (ctx.isPointInPath(el.path, mouse.original.x, mouse.original.y)) {
          element = el;
          return true;
        }
      };
      connections.some(hovered);
      supports.some(hovered);

      // Set elementHover to result of Array.some(hovered) check
      setElementHover(element);
    };

    // Check if the mouse coords align with any of the connection elements coords
    const handleConnectionAlignment = () => {
      if (elementType === "beam") return;
      for (const element of [...connections, ...supports]) {
        // Find if checked connection exists in alignments
        // const alignmentConnection = alignments.find(
        //   (al) => al.element.id === element.id
        // );

        // Connection and mouse coords align
        // Add connection to alignments if it does not already exist in alignments
        const prox = 10;

        // Check if vertical alignment band is valid
        if (
          mouse.transformed.x > element.x - prox &&
          mouse.transformed.x < element.x + prox
        ) {
          // console.log(alignments);
          if (!alignments.y) {
            const alignmentsCopy = { ...alignments };
            alignmentsCopy.y = new Alignment(element, mouse, prox);
            setAlignments(alignmentsCopy);
            // alignmentsCopy.y.draw(ctx);
            console.log(alignmentsCopy);
          } else if (alignments.y.element.id === element.id) {
            if (alignments.y.element.y !== mouse.transformed.y) {
              const alignmentsCopy = { ...alignments };
              alignmentsCopy.y = new Alignment(element, mouse, prox);
              setAlignments(alignmentsCopy);
              // alignmentsCopy.y.draw(ctx);
              console.log(alignmentsCopy);
            }
          }
        }

        // Check if horizontal alignment band is valid
        else if (
          mouse.transformed.y > element.y - prox &&
          mouse.transformed.y < element.y + prox
        ) {
          if (!alignments.x) {
            const alignmentsCopy = { ...alignments };
            alignmentsCopy.x = new Alignment(element, mouse, prox);
            setAlignments(alignmentsCopy);
            // alignmentsCopy.x.draw(ctx);
            console.log(alignmentsCopy);
          } else if (alignments.x.element.id === element.id) {
            if (alignments.x.element.x !== mouse.transformed.x) {
              const alignmentsCopy = { ...alignments };
              alignmentsCopy.x = new Alignment(element, mouse, prox);
              setAlignments(alignmentsCopy);
              // alignmentsCopy.x.draw(ctx);
              console.log(alignmentsCopy);
            }
          }
        }

        // Connection and mouse coords do not align
        // Remove from alignments if connection exists in alignments
        else {
          if (alignments.x && alignments.x.element.id === element.id) {
            const alignmentsCopy = { ...alignments };
            alignmentsCopy.x = undefined;
            setAlignments(alignmentsCopy);
          }
          if (alignments.y && alignments.y.element.id === element.id) {
            const alignmentsCopy = { ...alignments };
            alignmentsCopy.y = undefined;
            setAlignments(alignmentsCopy);
          }
        }
      }
    };

    handleElementHover();
    handleConnectionAlignment();
  };

  const handleClick = (event) => {
    console.log("BEAMS: ", beams);
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

    const handleBeamClick = () => {
      if (elementHover) {
        const beamId = `${beams.length + 1}B`;
        if (pendingElement) {
          if (pendingElement.id === elementHover.id) return;
          setBeams([...beams, new Beam(beamId, pendingElement, elementHover)]);
          setPendingElement(undefined);
        } else {
          setPendingElement(elementHover);
        }
      }
    };

    // Create new Support element
    const handleSupportClick = () => {
      const supportId = `${supports.length + 1}S`;
      setSupports([
        ...supports,
        new Support(supportId, mouse.transformed.x, mouse.transformed.y, scale),
      ]);
    };

    if (elementType === "connection") handleConnectionClick();
    else if (elementType === "beam") handleBeamClick();
    else if (elementType === "support") handleSupportClick();
  };

  const handleContextMenu = (event) => {
    console.log(event);
    // event.preventDefault();
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
    console.log(elementHover);
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
      onContextMenu={handleContextMenu}
      // onWheel={handleWheel}
      onAuxClick={handleAuxClick}
    />
  );
};
