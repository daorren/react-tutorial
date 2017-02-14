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
    return <Square value={this.props.squares[i]} key={i} onClick={() => this.props.onClick(i)}/>;
  }

  renderBody(rows, columns) {
    let body = [];
    for (let i = 0; i < rows; i++) {
      let square_row = [];
      for (let j = 0; j < columns; j++) {
        square_row.push(this.renderSquare(i * columns + j))
      }
      body.push([<div className="board-row">{square_row}</div>])
    }
    // 返回的body是个嵌套数组，[[<div>[sq, sq, sq]</div>], [], []]。
    // [<div>[sq, sq, sq]</div>, <>, <>]而这种是无效的
    return body
  }

  render() {
    return (
      <div>
        {this.renderBody(3, 3)}
      </div>
    );
  }
}

class MoveList extends React.Component {
  constructor() {
    super();
    this.state = {
      isSelected: null,
      isAscending: true
    }
  }
  handleClick(i) {
    this.setState({
      isSelected: i
    })
  }
  clickButton() {
    this.setState({isAscending: !this.state.isAscending})
  }
  render() {
    let arr = Array(this.props.history.length).fill().map((x, i) => i)
    let arr_with_direction = this.state.isAscending ? arr : arr.reverse();
    const moves = arr_with_direction.map((val, index) => {
      const desc = val ?
        'Move #' + val :
        'Game start';
      return (
        <li key={val}>
          {computeCoordinate(this.props.locations[val])}
          <a href="#" onClick={() => {
              this.props.onClick(val);
              this.handleClick(val);
            }}>{this.state.isSelected == val ? <b>{desc}</b> : desc} {/* desc在大括号里面的大括号 */}
          </a>
        </li>
      );
    });
    return(
      // 这里必须把两个元素用一个div包起来，否则报错 Adjacent JSX elements must be wrapped in an enclosing tag
      // React中，return要么只返回一个元素，要么以数组的形式返回。
      <div>
        <button onClick={() => this.clickButton()}>{this.state.isAscending ? 'Descend' : 'Ascend'}</button>
        <ul>{moves}</ul>
        {/* //我才想起来moves是个数组，之前以为必须是组件、HTML、JS最简单的字符串数字这样的数据结构。 */}
        {/* // 通过上面这行注释，我明白了一件事。在元素tag的开始标签如 <ul>之后，是jsx语法。某个结束标签如</ul>之后，又是普通的js。 */}
      </div>


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
