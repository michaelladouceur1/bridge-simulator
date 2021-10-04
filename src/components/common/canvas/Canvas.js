import { useState, useLayoutEffect, useContext, useEffect } from "react";
import { ElementsContext } from "../../../contexts/ElementsContext";
import { ThemeContext } from "../../../contexts/ThemeContext";

import "./Canvas.scss";

// todo Default colors needed
// Parameters
const radius = 6;
const colors = {
  canvasBackground: "#141414",
  elementMain: "#949494",
  elementAux: "#666666",
  lockedElement: "#ff6969",
};

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

export const Canvas = (props) => {
  const {
    classes,
    elements,
    placements,
    cssClasses = [],
    keypressEventListeners,
  } = props;

  const {
    alignments,
    setAlignments,
    elementType,
    elementHover,
    setElementHover,
    moveElement,
    setMoveElement,
  } = useContext(ElementsContext);

  const { isLight, contextMenu, setContextMenu } = useContext(ThemeContext);

  const [appliedCssClasses, setAppliedCssClasses] = useState("");
  const [mouse, setMouse] = useState({ x: undefined, y: undefined });

  useEffect(() => {
    window.addEventListener("keyup", (event) => {
      keypressEventListeners.forEach((listener) => {
        if (event.key === listener.key) {
          listener.action();

          return;
        }
      });
    });
  }, []);

  // todo
  useEffect(() => {
    // todo CSS classes should be passed in as props
    // todo Default classes should be there in case classes aren't passed as props
    const standardCssClasses = [
      {
        value: elementHover,
        classTrue: "hovered",
        classFalse: "",
      },
    ];

    const defaultCssClasses = [
      {
        value: isLight,
        classTrue: "dark",
        classFalse: "light",
      },
    ];

    const classesString = [
      ...standardCssClasses,
      ...defaultCssClasses,
      ...cssClasses,
    ]
      .map((obj) => {
        return obj.value || obj.value === true ? obj.classTrue : obj.classFalse;
      })
      .join(" ");

    setAppliedCssClasses(classesString);
  }, [elementHover, isLight]);

  // * Complete
  // todo
  useLayoutEffect(() => {
    // Combine all rendered elements

    // todo Elements should be passed in as props
    const allElements = getAllElements();
    // console.log(allElements);

    // Set canvas and context; Clear canvas for new render
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    // Render elements
    for (const el of allElements) {
      el.draw(ctx);
    }

    if (alignments.x) {
      alignments.x.draw(ctx);
    }
    if (alignments.y) {
      alignments.y.draw(ctx);
    }

    // createGrid();
  }, [...elements, alignments]);

  const getAllElements = () => {
    return elements.reduce((acc, cv) => [...acc, ...cv]);
  };

  const getAlignedElements = () => {
    return getAllElements().filter((element) => element.aligned === true);
  };

  const getUnalignedElementsType = () => {
    return classes
      .map((cls) => new cls())
      .filter((inst) => inst.aligned === false)
      .map((unaligned) => unaligned.type);
  };

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

  const handleMouseUp = () => {
    if (moveElement) {
      const contextMenuCopy = { ...contextMenu };
      contextMenuCopy.visible = true;
      setContextMenu(contextMenuCopy);
      setMoveElement(undefined);
    }
  };

  // * Complete
  // todo
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

    // * Complete
    // todo Function should use elements prop that gets passed in
    // Check if the mouse is hovering over the same position as a connection element
    const handleElementHover = () => {
      // Initialize hovered function for checking if the mouse is hovered over a connection element
      const elements = getAllElements();
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

      elements.some(hovered);

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

        // todo Potentially have contextMenu be passed in as prop
        const contextMenuCopy = { ...contextMenu };
        contextMenuCopy.x = placementX - 20;
        contextMenuCopy.y = placementY + 20;
        moveElement.x = placementX;
        moveElement.y = placementY;
        setContextMenu(contextMenuCopy);
      }
    };

    // * Complete
    // todo Passed in elements should have an aligned parameter to see if alignments apply to them. If not, return
    // Check if the mouse coords align with any of the connection elements coords
    const handleConnectionAlignment = () => {
      if (getUnalignedElementsType().includes(elementType)) return;

      const prox = 15;
      const elements = getAlignedElements();
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

  // todo
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

    if (elementType) {
      const place = placements[elementType];
      place.action({
        id: `${checkIdNumber(place.elements, place.id)}${place.id}`,
        placementX: placementX,
        placementY: placementY,
        scale: scale,
      });
    }
  };

  // todo Potentially pass contextMenu in as prop
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

  return (
    <canvas
      className={appliedCssClasses}
      width={window.innerWidth}
      height={window.innerHeight}
      // onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onAuxClick={handleAuxClick}
    />
  );
};
