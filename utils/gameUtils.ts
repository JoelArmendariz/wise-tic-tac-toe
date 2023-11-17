const ALL_BOARD_COORDINATES = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 0],
  [1, 1],
  [1, 2],
  [2, 0],
  [2, 1],
  [2, 2],
];

/**
 * Checks a board matrix for a winning row or returns the full matrix if no winner
 * @params board
 */
export const getWinningOrTieRows = (board: string[][]): number[][] | undefined => {
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

  const allPiecesPlaced = !board.find(row => row.find(tile => tile === '-'));

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

  if (allPiecesPlaced) {
    return ALL_BOARD_COORDINATES;
  }
};
