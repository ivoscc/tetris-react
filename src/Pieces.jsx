const pieces = {
  I: [[2, 2, 2, 2]],
  J: [[2, 2, 2], [0, 0, 2]],
  L: [[2, 2, 2], [2, 0, 0]],
  O: [[2, 2], [2, 2]],
  S: [[0, 2, 2], [2, 2, 0]],
  T: [[2, 2, 2], [0, 2, 0]],
  Z: [[2, 2, 0], [0, 2, 2]],
};

export function getRandomPiece() {
  const pieceIdentifiers = Object.keys(pieces);
  const randomIndex = Math.floor(Math.random() * pieceIdentifiers.length);
  return pieces[pieceIdentifiers[randomIndex]];
}

export function rotatePiece(piece) {
  const pieceHeight = piece.length;
  const pieceWidth = piece[0].length;
  const rotated = [];
  for (let colIndex = 0; colIndex < pieceWidth; colIndex += 1) {
    if (rotated[colIndex] === undefined) { rotated.push([]); }
    for (let rowIndex = pieceHeight - 1; rowIndex >= 0; rowIndex -= 1) {
      rotated[colIndex].push(piece[rowIndex][colIndex]);
    }
  }
  return rotated;
}
