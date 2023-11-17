/**
 * Checks a board matrix for a winning row
 * @params board
 */
export const getWinningGameRow = (board: string[][]): number[][] | undefined => {
  const possibleWinningCoordinates = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [2, 0],
      [1, 1],
      [0, 2],
    ],
  ];

  for (const coordinates of possibleWinningCoordinates) {
    const firstPiece = board[coordinates[0][0]][coordinates[0][1]];
    if (firstPiece === '-') continue;
    let piecesInARowCount = 0;
    for (const coordinate of coordinates) {
      const [x, y] = coordinate;
      if (board[x][y] === firstPiece) {
        piecesInARowCount++;
      } else {
        break;
      }
    }
    if (piecesInARowCount === 3) {
      return coordinates;
    }
  }
};
