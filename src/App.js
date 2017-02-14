import React, { Component } from 'react';
import logo from './logo.svg'
import './App.css'

function Square(props) {
  return(
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {

  renderSquare(i) {
    // 这里很神奇，既是调用Square，又可以看做是Board的定义。
    // this指的是Board，通过携带参数 i，把 onClick 事件分散出去到每个 square 上。
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class MoveList extends React.Component {
  constructor() {
    super();
    this.state = {
      isSelected: null
    }
  }
  handleClick(i) {
    this.setState({
      isSelected: i
    })
  }
  render() {
    const moves = this.props.history.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start';
      return (
        <li key={move}>
          {computeCoordinate(this.props.locations[move])}
          <a href="#" onClick={() => {
              this.props.onClick(move);
              this.handleClick(move);
            }}>{this.state.isSelected == move ? <b>{desc}</b> : desc} {/* desc在大括号里面的大括号 */}
          </a>
        </li>
      );
    });
    return(
      <ul>{moves}</ul>
    )
  }
}


class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      locations: [0]
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      locations: this.state.locations.slice(0, history.length).concat([i + 1])
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const locations = this.state.locations

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <MoveList history={history} locations={locations} onClick={(i) => this.jumpTo(i)} />
        </div>
      </div>
    );
  }
}

// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function computeCoordinate(n) {
  if (n === 0) {
    return null
  }
  const x = (n % 3) === 0 ? parseInt(n / 3, 10) : parseInt(n / 3, 10) + 1;
  const y = (n % 3) === 0 ? 3 : (n % 3);
  return `(${x}, ${y})`; // ES6 字符串插值
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="App-intro">
          <Game />
        </div>
      </div>
    );
  }
}

export default App;
