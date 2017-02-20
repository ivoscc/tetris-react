import React, {
  Component,
} from 'react';
import ReactDOM from 'react-dom';

import Grid from './Grid.jsx';
import { getRandomPiece, rotatePiece } from './Pieces.jsx';

class Game extends Component {

  constructor(props) {
    super(props);

    this.state = {
      piece: getRandomPiece(),
      piecePosition: [0, 0],
      gameOver: false,
    };

    this.tick = this.tick.bind(this);
    this.stop = this.stop.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.outOfBounds = this.outOfBounds.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);

  }

  componentDidMount() {
    window.setTimeout(this.tick, 2000);
    document.body.addEventListener('keydown', this.handleKeyboard);
  }

  tick() {
    if (!this.state.gameOver) {
      const [y, x] = this.state.piecePosition;
      this.setState({ piecePosition: [y + 1, x] });
      window.setTimeout(this.tick, 400);
    }
  }

  outOfBounds(piece, piecePosition) {
    this.setState({ piece, piecePosition });
  }

  stop() {
    this.setState({ piece: getRandomPiece(), piecePosition: [0, 0] });
  }

  gameOver() {
    this.setState({ gameOver: true });
  }

  handleKeyboard(event) {
    // TODO: Add ArrowDown handler
    switch (event.key) {
      case 'ArrowRight': {
        const [Y, X] = this.state.piecePosition;
        this.setState({ piecePosition: [Y, X + 1] });
        break;
      }
      case 'ArrowLeft': {
        const [Y, X] = this.state.piecePosition;
        this.setState({ piecePosition: [Y, X - 1] });
        break;
      }
      case 'ArrowUp': {
        this.setState({ piece: rotatePiece(this.state.piece) });
        break;
      }
      default:
    }
  }

  render() {
    return (
      <Grid
        width={10}
        height={15}
        piece={this.state.piece}
        piecePosition={this.state.piecePosition}
        stopFn={this.stop}
        gameOverFn={this.gameOver}
        outOfBoundsFn={this.outOfBounds}
      />);
  }

}

class App extends Component {
  render() {
    return <Game />;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
