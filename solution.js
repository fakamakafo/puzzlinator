function solvePuzzle(pieces) {
  const lineSize = Math.sqrt(pieces.length);
  let lineItemNum = 1;

  let result = [];
  let connectionIDs = {};
  let mappedPieces = {};

  let verticalLine = [];
  let resultPuzzle = [];

  // Rotate 1st element & fill mapped objects (connectionIDs, mappedPieces)
  pieces.forEach(item => {
    if (item.id === pieces[0].id) {
      if (!!item.edges.left && !!item.edges.top) {
        item.edges = {
          left: null,
          top: null,
          bottom: item.edges.top,
          right: item.edges.left,
        }
      } else if (!!item.edges.left && !!item.edges.bottom) {
        item.edges = {
          left: null,
          top: null,
          bottom: item.edges.left,
          right: item.edges.bottom,
        }
      } else if (!!item.edges.right && !!item.edges.top) {
        item.edges = {
          left: null,
          top: null,
          bottom: item.edges.right,
          right: item.edges.top,
        }
      }
    }

    for (let edge in item.edges) {
      if (item.edges[edge]) {
        if (!!connectionIDs[item.edges[edge].edgeTypeId]) {
          connectionIDs[item.edges[edge].edgeTypeId].push(item.id);
        } else {
          connectionIDs[item.edges[edge].edgeTypeId] = [item.id];
        }
      }
    }

    mappedPieces[item.id] = {
      edges: item.edges,
      id: item.id
    };
  });

  /**
   * Rotate bottom piece
   * @param piece
   * @param topEdgeId
   * @returns {{edges: {}, id: *}|*}
   */
  const rotatePieceBottom = (piece, topEdgeId) => {
    let edges = {};

    if (piece.edges.top?.edgeTypeId === topEdgeId) {
      return piece;
    } else if (piece.edges.right?.edgeTypeId === topEdgeId) {
      edges = {
        top: piece.edges.right,
        right: piece.edges.bottom,
        bottom: piece.edges.left,
        left: piece.edges.top,
      }
    } else if (piece.edges.left?.edgeTypeId === topEdgeId) {
      edges = {
        top: piece.edges.left,
        right: piece.edges.top,
        bottom: piece.edges.right,
        left: piece.edges.bottom,
      }
    } else if (piece.edges.bottom?.edgeTypeId === topEdgeId) {
      edges = {
        top: piece.edges.bottom,
        right: piece.edges.left,
        bottom: piece.edges.top,
        left: piece.edges.right,
      }
    }

    if (Object.values(edges).length) {
      return {
        edges,
        id: piece.id
      };
    } else {
      return piece;
    }
  };

  /**
   * Rotate right piece
   * @param piece
   * @param leftEdgeId
   * @returns {{edges: {}, id: *}|*}
   */
  const rotatePieceRight = (piece, leftEdgeId) => {
    let edges = {};

    if (piece.edges.left?.edgeTypeId === leftEdgeId) {
      return piece;
    } else if (piece.edges.top?.edgeTypeId === leftEdgeId) {
      edges = {
        top: piece.edges.right,
        right: piece.edges.bottom,
        bottom: piece.edges.left,
        left: piece.edges.top,
      }
    } else if (piece.edges.right?.edgeTypeId === leftEdgeId) {
      edges = {
        top: piece.edges.bottom,
        right: piece.edges.left,
        bottom: piece.edges.top,
        left: piece.edges.right,
      }
    } else if (piece.edges.bottom?.edgeTypeId === leftEdgeId) {
      edges = {
        top: piece.edges.left,
        right: piece.edges.top,
        bottom: piece.edges.right,
        left: piece.edges.bottom,
      }
    }

    if (Object.values(edges).length) {
      return {
        edges,
        id: piece.id
      };
    } else {
      return piece;
    }
  };

  /**
   * Place puzzle piece (right || bottom)
   * @param piece
   * @param vertical
   * @returns {[]}
   */
  const placePiece = (piece, vertical) => {
    if (lineItemNum === 1) {
      result = [piece];
    } else if (result.length === lineSize) {
      lineItemNum = 1;
      return result;
    }

    const edges = Object.values(mappedPieces[piece].edges).filter(edge => !!edge);

    for (let i = 0; i < edges.length; i++) {
      const neighbour = connectionIDs[edges[i].edgeTypeId].filter(edge => edge !== +piece)[0];
      const neighbourConnectionIDs = Object.values(mappedPieces[neighbour].edges)
          .filter(edge => !!edge)
          .map(edge => edge.edgeTypeId);

      if (vertical) {
        if (!mappedPieces[piece].edges.bottom) {
          break;
        }

        mappedPieces[neighbour] = rotatePieceBottom(mappedPieces[neighbour], mappedPieces[piece].edges.bottom.edgeTypeId);

        if (mappedPieces[piece].edges.bottom && neighbourConnectionIDs.includes(mappedPieces[piece].edges.bottom.edgeTypeId)) {
          result.push(mappedPieces[neighbour].id);
          lineItemNum++;
          placePiece(mappedPieces[neighbour].id, true);
        }
      } else {
        if (!mappedPieces[piece].edges.right) {
          break;
        }

        mappedPieces[neighbour] = rotatePieceRight(mappedPieces[neighbour], mappedPieces[piece].edges.right.edgeTypeId);

        if (mappedPieces[piece].edges.right && neighbourConnectionIDs.includes(mappedPieces[piece].edges.right.edgeTypeId)) {
          result.push(mappedPieces[neighbour].id);
          lineItemNum++;
          placePiece(mappedPieces[neighbour].id, false);
        }
      }

    }

    return result;
  };

  const firstRow = placePiece(pieces[0].id, false);

  for (let a = 0; a < firstRow.length; a++) {
    const vertArr = placePiece(firstRow[a], true);
    verticalLine.push(vertArr)
  }

  transpose(verticalLine).forEach(el => {
    resultPuzzle = resultPuzzle.concat(el)
  });

  return resultPuzzle;
}

/**
 * Helper function to transpose the matrix
 * @param matrix
 * @returns {*}
 */
const transpose = matrix => {
  for (let row = 0; row < matrix.length; row++) {
    for (let column = 0; column < row; column++) {
      let temp = matrix[row][column];
      matrix[row][column] = matrix[column][row];
      matrix[column][row] = temp
    }
  }
  return matrix;
};

window.solvePuzzle = solvePuzzle;

