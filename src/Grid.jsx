import React, { Component } from 'react';

export default class Grid extends Component {

  constructor(props) {
    super(props);

    this.state = {
      positions: new Array(this.props.width * this.props.height).fill(0),
      clearNext: true,
      ignoreLast: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const positions = this.state.positions;
    const currentPiece = this.props.piece;
    const currentPosition = this.props.piecePosition;
    const nextPiece = nextProps.piece;
    const nextPosition = nextProps.piecePosition;

    // If last movement was invalid, we don't care about validating the current
    // one, because this update is the parent re-setting the position to the
    // previous good value.
    if (this.state.ignoreLast) {
      this.state.ignoreLast = false;
      return;
    }

    const goingDown = (nextPosition[0] > currentPosition[0]);
    if (this.outOfBounds(nextPiece, nextPosition) ||
        this.checkCollision(nextPiece, nextPosition)) {
      this.state.ignoreLast = true;
      if (goingDown) {
        if (nextPosition[0] === 1) {
          // We've collided in the first position
          this.props.gameOverFn();
        } else {
          this.setPieceValues(positions, currentPiece, currentPosition, 1);
          this.props.stopFn();
        }
        return;
      }
      this.props.outOfBoundsFn(currentPiece, currentPosition);
      return;
    }

    // Clear previous piece position
    if (this.state.clearNext) {
      this.setPieceValues(positions, currentPiece, currentPosition, 0);
    }

    // Draw current piece
    this.setPieceValues(positions, nextPiece, nextPosition);
    this.setState({ positions, clearNext: true });
  }

  setPieceValues(positions, piece, piecePosition, fixedValue = null) {
    const [startY, startX] = piecePosition;
    const startOffset = (startY * this.props.width) + startX;

    for (let rowOffset = 0; rowOffset < piece.length; rowOffset += 1) {
      piece[rowOffset].forEach((value, colOffset) => {
        const offset = startOffset + (this.props.width * rowOffset) + colOffset;
        const newValue = (fixedValue === null) ? value : fixedValue;
        if (value === 2) {
          positions[offset] = newValue;
        }
      });
    }
  }

  deleteFullRows(positions, piece, piecePosition) {
    const pieceY = piecePosition[0];
    let deletedLinesCounter = 0;
    let lowestDeletedLineOffset = 0;
    for (let rowIndex = pieceY; rowIndex < pieceY + piece.length; rowIndex += 1) {
      const rowOffset = rowIndex * this.props.width;
      const row = positions.slice(rowOffset, rowOffset + this.props.width);
      if (row.indexOf(0) === -1) {
        deletedLinesCounter += 1;
        lowestDeletedLineOffset = rowOffset;
        for (let colIndex = 0; colIndex < this.props.width; colIndex += 1) {
          positions[rowOffset + colIndex] = 0;
        }
      }
    }

    if (deletedLinesCounter > 0) {
      positions.copyWithin(deletedLinesCounter * this.props.width, 0, lowestDeletedLineOffset);
      positions.fill(0, 0, deletedLinesCounter * this.props.width);
    }

    return (deletedLinesCounter > 0);
  }


  reachedTheBottom(piece, nextPosition) {
    return (piece.length + nextPosition[0] > this.props.height);
  }

  outOfBounds(piece, nextPosition) {
    const [nextY, nextX] = nextPosition;
    const pieceWidth = piece[0].length;
    const pieceHeight = piece.length;
    return (nextY + pieceHeight > this.props.height ||
            nextX < 0 ||
            nextX + pieceWidth > this.props.width);
  }

  checkCollision(piece, nextPosition) {
    const pieceHeight = piece.length;
    const pieceWidth = piece[0].length;
    const [nextY, nextX] = nextPosition;

    for (let rowOffset = 0; rowOffset < pieceHeight; rowOffset += 1) {
      for (let colOffset = 0; colOffset < pieceWidth; colOffset += 1) {
        if (piece[rowOffset][colOffset] !== 0) {
          const offset = ((nextY + rowOffset) * this.props.width) + nextX + colOffset;
          if (this.state.positions[offset] === 1) {
            return true;
          }
        }
      }
    }
    return false;
  }

  createRow(rowIndex) {
    const sliceStart = rowIndex * this.props.width;
    const sliceEnd = (rowIndex + 1) * this.props.width;
    const createItem = (value, colIndex) => (
      <td key={(rowIndex, colIndex)} className={(value !== 0) ? 'piece' : ''} />
    );
    return this.state.positions.slice(sliceStart, sliceEnd).map(createItem);
  }

  createGrid() {
    const rows = [];
    for (let rowIndex = 0; rowIndex < this.props.height; rowIndex += 1) {
      rows.push(this.createRow(rowIndex));
    }
    return rows.map((row, rowIndex) => (<tr key={rowIndex}>{row}</tr>));
  }

  render() {
    return (
      <table className="grid">
        <tbody>{this.createGrid()}</tbody>
      </table>
    );
  }
}

Grid.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  piece: React.PropTypes.array,
  piecePosition: React.PropTypes.array,
  stopFn: React.PropTypes.func.isRequired,
  gameOverFn: React.PropTypes.func.isRequired,
  outOfBoundsFn: React.PropTypes.func.isRequired,
};

Grid.defaultProps = {
  piece: [],
  piecePosition: [0, 0],
};
