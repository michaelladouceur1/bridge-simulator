import React, { createContext, useState } from "react";
import numeric from "numeric";

export const ElementsContext = createContext(null);

export const ElementsContextProvider = ({ children }) => {
  const [allElements, setAllElements] = useState([]);
  const [alignments, setAlignments] = useState({ x: undefined, y: undefined });
  const [elementType, setElementType] = useState(undefined);
  const [connections, setConnections] = useState([]);
  const [beams, setBeams] = useState([]);
  const [supports, setSupports] = useState([]);
  const [forces, setForces] = useState([]);
  const [elementHover, setElementHover] = useState(false);
  const [pendingElement, setPendingElement] = useState(undefined);
  const [moveElement, setMoveElement] = useState(false);

  const solve = () => {
    const initializeMatrixA = () => {
      const matrix = new Map();

      const initializeRows = (elements) => {
        elements.forEach((element) => {
          matrix.set(`${element.id}X`, new Array(beams.length).fill(0));
          matrix.set(`${element.id}Y`, new Array(beams.length).fill(0));
        });
      };

      initializeRows(connections);
      matrix.set(`${supports[1].id}X`, new Array(beams.length).fill(0));

      return matrix;
    };

    const initializeMatrixB = () => {
      return new Array(connections.length * 2 + 1).fill(0);
    };

    const createMatrixA = (matrix) => {
      const calculateAngle = (conn, beam) => {
        let deltaX = 0;
        let deltaY = 0;
        if (conn.id === beam.el2.id) {
          deltaX = beam.el1.x - beam.el2.x;
          deltaY = beam.el2.y - beam.el1.y;
        } else {
          deltaX = beam.el2.x - beam.el1.x;
          deltaY = beam.el1.y - beam.el2.y;
        }
        return Math.atan2(deltaY, deltaX);
      };

      connections.forEach((conn) => {
        const mtrxX = [...matrix.get(`${conn.id}X`)];
        const mtrxY = [...matrix.get(`${conn.id}Y`)];
        conn.beams.forEach((beam) => {
          const idx = Number(beam.id.split("B")[0]) - 1;
          const angle = calculateAngle(conn, beam);
          mtrxX[idx] = Math.cos(angle);
          mtrxY[idx] = Math.sin(angle);
        });
        matrix.set(`${conn.id}X`, mtrxX);
        matrix.set(`${conn.id}Y`, mtrxY);
      });

      const supp = supports[1];
      const mtrx = matrix.get(`${supp.id}X`);
      supp.beams.forEach((beam) => {
        const idx = Number(beam.id.split("B")[0]) - 1;
        const angle = calculateAngle(supp, beam);
        mtrx[idx] = Math.cos(angle);
      });
      matrix.set(`${supp.id}X`, mtrx);

      return matrix;
    };

    const createMatrixB = (matrix) => {
      forces.forEach((force) => {
        const idx = force.element.id.split("C")[0] * 2 - 1;
        matrix[idx] = force.magnitude * -1;
      });
      return matrix;
    };

    const initMatrixA = initializeMatrixA();
    const initMatrixB = initializeMatrixB();
    const mapA = createMatrixA(initMatrixA);
    const matrixB = createMatrixB(initMatrixB);
    const matrixA = [];
    mapA.forEach((row) => {
      matrixA.push(row);
    });
    const matrixAInv = numeric.inv(matrixA);

    console.log(mapA);
    console.log(matrixA);
    console.log(matrixB);
    console.log(matrixAInv);
    console.log(numeric.dot(matrixAInv, matrixB));
  };

  const solveReactionForces = () => {
    if (supports.length >= 2 && forces.length > 0) {
      const totalForces = forces.reduce((acc, cv) => {
        return acc + cv.magnitude;
      }, 0);

      const totalMoments = forces
        .map((force) => {
          const dist = supports[0].x - force.element.x;
          return dist * force.magnitude;
        })
        .reduce((acc, cv) => {
          return acc + cv;
        }, 0);

      const s2Force =
        -1 * (totalMoments / Math.abs(supports[0].x - supports[1].x));
      const s1Force = totalForces - s2Force;

      console.log("Forces: ", totalForces);
      console.log("Moments: ", totalMoments);
      console.log("F1: ", s1Force);
      console.log("F2: ", s2Force);
      // return {};
    }
  };

  const updateConnection = (callback, elementId) => {
    const connectionsCopy = [...connections];
    connectionsCopy.forEach((element) => {
      if (element.id === elementId) {
        callback();
      }
    });
    setConnections(connectionsCopy);
  };

  const updateSupport = (callback, elementId) => {
    const supportsCopy = [...supports];
    supportsCopy.forEach((element) => {
      if (element.id === elementId) {
        callback();
      }
    });
    setSupports(supportsCopy);
  };

  return (
    <ElementsContext.Provider
      value={{
        allElements,
        setAllElements,
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
        updateConnection,
        updateSupport,
        solve,
        solveReactionForces,
      }}
    >
      {children}
    </ElementsContext.Provider>
  );
};
