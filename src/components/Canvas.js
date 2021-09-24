import React, { useState, useLayoutEffect, useContext, useEffect } from "react";
import { ElementsContext } from "../contexts/ElementsContext";
import { ThemeContext } from "../contexts/ThemeContext";

import "./Canvas.scss";

// Parameters
const radius = 6;
const colors = {
  canvasBackground: "#141414",
  elementMain: "#949494",
  elementAux: "#666666",
  lockedElement: "#ff6969",
};

// Connection element
function Connection(id, x, y, scale) {
  this.id = id;
  this.type = "connection";
  this.x = x / scale;
  this.y = y / scale;
  this.radius = radius;
  this.locked = false;

  this.draw = function (ctx) {
    this.path = new Path2D();
    ctx.beginPath();
    this.path.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    ctx.fillStyle = colors.canvasBackground;
    ctx.strokeStyle = this.locked ? colors.lockedElement : colors.elementAux;
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
  this.id = id;
  this.type = "beam";
  this.el1 = el1;
  this.el2 = el2;

  this.calculateTextCoords = function () {
    const offset = 15;
    const o =
      Math.max(this.el1.y, this.el2.y) - Math.min(this.el1.y, this.el2.y);
    const a =
      Math.max(this.el1.x, this.el2.x) - Math.min(this.el1.x, this.el2.x);
    const angle = Math.atan(o / a);

    return {
      x: (this.el1.x + this.el2.x) / 2 + Math.abs(offset * Math.sin(angle)),
      y: (this.el1.y + this.el2.y) / 2 + Math.abs(offset * Math.cos(angle)),
    };
  };

  this.draw = function (ctx) {
    ctx.beginPath();
    this.path = new Path2D();

    // Draw beam
    ctx.lineWidth = 3;
    ctx.globalCompositeOperation = "destination-over";
    ctx.strokeStyle = colors.elementMain;
    this.path.moveTo(el1.x, el1.y);
    this.path.lineTo(el2.x, el2.y);
    ctx.stroke(this.path);
    ctx.globalCompositeOperation = "source-over";

    // Add beam ID text
    ctx.font = "Arial 10px";
    ctx.fillStyle = colors.elementMain;
    const { x, y } = this.calculateTextCoords();
    ctx.fillText(this.id, x, y);
    ctx.closePath();
  };
}

// Support element
function Support(id, x, y, scale) {
  this.id = id;
  this.type = "support";
  this.x = x / scale;
  this.y = y / scale;
  this.locked = false;

  this.draw = function (ctx) {
    ctx.fillStyle = this.locked ? colors.lockedElement : colors.elementMain;
    ctx.strokeStyle = colors.elementAux;
    ctx.lineWidth = 1;
    this.path = new Path2D();
    this.path.rect(0, 0, 0, 0);
    let p2 = new Path2D(
      "M 12 12 L 6 12 L 3 9 L -3 9 L -6 12 L -12 12 L -6 -3 C -3 -9 3 -9 6 -3 L 12 12 M -3 0 A 3 3 90 0 0 3 0 A 3 3 90 0 0 -3 0"
    );
    let m = new DOMMatrix();
    m.e = this.x;
    m.f = this.y;
    this.path.addPath(p2, m);
    ctx.stroke(this.path);
    ctx.fill(this.path);
  };
}

function Force(id, element) {
  this.id = id;
  this.type = "force";
  this.element = element;
  this.magnitude = 0;
  this.angle = 0;

  this.draw = function (ctx) {
    const offset = 40;
    ctx.fillStyle = colors.elementMain;
    ctx.lineWidth = 1;
    this.path = new Path2D();
    this.path.rect(0, 0, 0, 0);
    let p2 = new Path2D(
      `M 0 ${24 + offset} L 6 ${14 + offset} L 2 ${14 + offset} M 0 ${
        24 + offset
      } L -6 ${14 + offset} L -2 ${14 + offset} L -2 0 L 2 0 L 2 ${14 + offset}`
    );
    let m = new DOMMatrix(`rotate(${this.angle}deg)`);
    m.e = this.element.x;
    m.f = this.element.y;
    this.path.addPath(p2, m);
    ctx.stroke(this.path);
    ctx.fill(this.path);
  };
}

// Alignment element
function Alignment(element, mouse, prox, axis) {
  this.element = element;
  this.mouse = mouse;

  this.draw = function (ctx) {
    // Parameters
    const offsetRatio = 2;
    let xOffset = 0;
    let yOffset = 0;

    ctx.beginPath();

    // Set style
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = colors.elementAux;

    // Set yOffset or xOffset for spacing from element
    if (axis === "y") {
      yOffset =
        this.element.y > this.mouse.transformed.y
          ? -(radius * offsetRatio)
          : radius * offsetRatio;
    } else {
      xOffset =
        this.element.x > this.mouse.transformed.x
          ? -(radius * offsetRatio)
          : radius * offsetRatio;
    }

    ctx.moveTo(this.element.x + xOffset, this.element.y + yOffset);

    // Draw alignment line
    if (axis === "x") {
      ctx.lineTo(this.mouse.transformed.x, this.element.y);
    } else {
      ctx.lineTo(this.element.x, this.mouse.transformed.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.closePath();
  };

  this.update = function () {};
}

export const Canvas = () => {
  const {
    alignments,
    setAlignments,
    elementType,
    setElementType,
    connections,
    setConnections,
    beams,
    setBeams,
    supports,
    setSupports,
    forces,
    setForces,
    elementHover,
    setElementHover,
    pendingElement,
    setPendingElement,
    moveElement,
    setMoveElement,
  } = useContext(ElementsContext);

  const { isLight, contextMenu, setContextMenu } = useContext(ThemeContext);

  const [cssClasses, setCssClasses] = useState("");
  const [mouse, setMouse] = useState({ x: undefined, y: undefined });
  const [mouseDown, setMouseDown] = useState(false);

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
    const elements = [...connections, ...beams, ...supports, ...forces];
    console.log(elements);

    // Set canvas and context; Clear canvas for new render
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    // Render elements
    for (const el of elements) {
      el.draw(ctx);
    }

    if (alignments.x) {
      alignments.x.draw(ctx);
    }
    if (alignments.y) {
      alignments.y.draw(ctx);
    }

    // createGrid();
  }, [connections, beams, supports, forces, alignments]);

  const createGrid = () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    const spacing = 15;
    const lineWidth = 0.5;

    const rows = Math.floor(window.innerHeight / spacing);
    const cols = Math.floor(window.innerWidth / spacing);

    // Columns
    let lines = 0;
    for (
      let i = (window.innerWidth % cols) / 2;
      i < window.innerWidth;
      i += spacing
    ) {
      ctx.beginPath();
      if (lines % 5 === 0) {
        ctx.lineWidth = 3 * lineWidth;
      } else {
        ctx.lineWidth = lineWidth;
      }
      ctx.strokeStyle = "gray";
      ctx.moveTo(i, 0);
      ctx.lineTo(i, innerHeight);
      ctx.stroke();
      ctx.closePath();
      lines++;
    }

    lines = 0;
    for (
      let i = (window.innerHeight % rows) / 2;
      i < window.innerHeight;
      i += spacing
    ) {
      ctx.beginPath();
      if (lines % 5 === 0) {
        ctx.lineWidth = 3 * lineWidth;
      } else {
        ctx.lineWidth = lineWidth;
      }
      ctx.strokeStyle = "gray";
      ctx.moveTo(0, i);
      ctx.lineTo(innerWidth, i);
      ctx.stroke();
      ctx.closePath();
      lines++;
    }
  };

  const handleMouseDown = (event) => {
    setMouseDown(true);
  };

  const handleMouseUp = () => {
    setMouseDown(false);
    if (moveElement) {
      const contextMenuCopy = { ...contextMenu };
      contextMenuCopy.visible = true;
      setContextMenu(contextMenuCopy);
      setMoveElement(undefined);
    }
  };

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

    // Check if the mouse is hovering over the same position as a connection element
    const handleElementHover = () => {
      // Initialize hovered function for checking if the mouse is hovered over a connection element
      let element = undefined;
      const hovered = (el) => {
        if (
          ctx.isPointInPath(el.path, mouse.original.x, mouse.original.y) ||
          ctx.isPointInStroke(el.path, mouse.original.x, mouse.original.y)
        ) {
          element = el;
          return true;
        }
      };
      connections.some(hovered);
      supports.some(hovered);
      beams.some(hovered);

      // Set elementHover to result of Array.some(hovered) check
      setElementHover(element);
    };

    const handleElementMove = () => {
      if (moveElement && !moveElement.locked) {
        let placementX = mouse.transformed.x;
        let placementY = mouse.transformed.y;
        if (alignments.x && alignments.x.element.id !== moveElement.id) {
          placementY = alignments.x.element.y;
        }
        if (alignments.y && alignments.y.element.id !== moveElement.id) {
          placementX = alignments.y.element.x;
        }

        const contextMenuCopy = { ...contextMenu };
        contextMenuCopy.x = placementX - 20;
        contextMenuCopy.y = placementY + 20;
        moveElement.x = placementX;
        moveElement.y = placementY;
        setContextMenu(contextMenuCopy);
      }
    };

    // Check if the mouse coords align with any of the connection elements coords
    const handleConnectionAlignment = () => {
      if (elementType === "beam") return;

      const prox = 15;
      const elements = [...connections, ...supports];
      const alignmentsCopy = { ...alignments };

      const checkAlignmentBand = (coord, element) => {
        return (
          mouse.transformed[coord] > element[coord] - prox &&
          mouse.transformed[coord] < element[coord] + prox
        );
      };

      const checkProximity = (coord, element) => {
        return (
          Math.abs(mouse.transformed[coord] - element[coord]) <
          Math.abs(
            mouse.transformed[coord] - alignmentsCopy[coord].element[coord]
          )
        );
      };

      // Check if alignments.x and alignments.y contain the same element
      // If so, setAlignments to undefined
      if (alignmentsCopy.x && alignmentsCopy.y) {
        if (alignmentsCopy.x.element.id === alignmentsCopy.y.element.id) {
          setAlignments({ x: undefined, y: undefined });
          return;
        }
      }

      for (const element of elements) {
        // Check if vertical alignment band is valid
        if (checkAlignmentBand("x", element)) {
          /*
          Check if alignmentsCopy.y element does not exists
          Check if alignmentsCopy.y element id is equal to current checked element id
          Check if alignmentsCopy.y element exists and see if it is closer to the mouse than the current checked element
          If so, assign a new alignment to alignmentsCopy.y
          */
          if (
            !alignmentsCopy.y ||
            alignmentsCopy.y.element.id === element.id ||
            (alignmentsCopy.y && checkProximity("y", element))
          ) {
            alignmentsCopy.y = new Alignment(element, mouse, prox, "y");
          }
        }

        // Check if horizontal alignment band is valid
        else if (checkAlignmentBand("y", element)) {
          /*
          Check if alignmentsCopy.x element does not exists
          Check if alignmentsCopy.x element id is equal to current checked element id
          Check if alignmentsCopy.x element exists and see if it is closer to the mouse than the current checked element
          If so, assign a new alignment to alignmentsCopy.x
          */
          if (
            !alignmentsCopy.x ||
            alignmentsCopy.x.element.id === element.id ||
            (alignmentsCopy.x && checkProximity("x", element))
          ) {
            alignmentsCopy.x = new Alignment(element, mouse, prox, "x");
          }
        }

        // Connection and mouse coords do not align
        // Remove from alignments if connection exists in alignments
        else {
          if (alignmentsCopy.x && alignmentsCopy.x.element.id === element.id) {
            alignmentsCopy.x = undefined;
          }
          if (alignmentsCopy.y && alignmentsCopy.y.element.id === element.id) {
            alignmentsCopy.y = undefined;
          }
        }
      }
      setAlignments(alignmentsCopy);
    };

    handleElementHover();
    handleElementMove();
    handleConnectionAlignment();
  };

  const handleClick = (event) => {
    if (contextMenu.visible) {
      setContextMenu(false);
      return;
    }

    /*
    todo: The border limiting doesn't work when zoomed out currently.
    Check if the click was too close to the edges
    Bug where the elements are being drawn multiple times on zoom
    const border = 10;
    if (
      mouse.transformed.x < border ||
      mouse.transformed.y < border ||
      mouse.transformed.x > window.innerWidth - border ||
      mouse.transformed.y > window.innerHeight - border
    ) {
      return;
    }
    */

    setAlignments({ x: undefined, y: undefined });

    let placementX = mouse.transformed.x;
    let placementY = mouse.transformed.y;
    if (alignments.x) {
      placementY = alignments.x.element.y;
    }
    if (alignments.y) {
      placementX = alignments.y.element.x;
    }

    // Create context and get transform for scale factor
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const { a: scale } = ctx.getTransform();

    const checkIdNumber = (elements, splitValue) => {
      if (elements.length === 0) return elements.length + 1;

      const maxId = elements.reduce((acc, cv) => {
        const idNum = Number(cv.id.split(splitValue)[0]);
        if (idNum > acc) return idNum;
      }, 0);

      return maxId > elements.length ? maxId + 1 : elements.length + 1;
    };

    // Create new Connection element
    const handleConnectionPlacement = () => {
      const connectionId = `${checkIdNumber(connections, "C")}C`;
      setConnections([
        ...connections,
        new Connection(connectionId, placementX, placementY, scale),
      ]);
    };

    const handleBeamPlacement = () => {
      if (elementHover) {
        const beamId = `${checkIdNumber(beams, "B")}B`;
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
    const handleSupportPlacement = () => {
      const supportId = `${checkIdNumber(supports, "S")}S`;
      setSupports([
        ...supports,
        new Support(supportId, placementX, placementY, scale),
      ]);
    };

    // Create new Force element
    const handleForcePlacement = () => {
      console.log("force click");
      if (elementHover && elementHover.type === "connection") {
        console.log(elementHover);
        console.log("hovered and connection");
        const forceId = `${checkIdNumber(forces, "F")}F`;
        setForces([...forces, new Force(forceId, elementHover)]);
      }
    };

    if (elementType === "connection") handleConnectionPlacement();
    else if (elementType === "beam") handleBeamPlacement();
    else if (elementType === "support") handleSupportPlacement();
    else if (elementType === "force") handleForcePlacement();
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    if (elementHover) {
      const contextMenuCopy = { ...contextMenu };
      contextMenuCopy.visible = true;
      contextMenuCopy.element = elementHover;
      contextMenuCopy.x = contextMenuCopy.element.x - 20;
      contextMenuCopy.y = contextMenuCopy.element.y + 20;
      setContextMenu(contextMenuCopy);
    }
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
    // console.log(mouse);
    // console.log(connections);
    // console.log(elementHover);
    // console.log("\n\n\n");
  };

  const handleKeyPress = (event) => {
    console.log(event);
  };

  window.addEventListener("keydown", (event) => {
    if (event.key === "c") setElementType("connection");
    else if (event.key === "b") setElementType("beam");
    else if (event.key === "s") setElementType("support");
    else if (event.key === "f") setElementType("force");
  });

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
