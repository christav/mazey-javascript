// Definitions of types and functions defining a maze

'use strict';

const directions = {
  none: 0,
  up: 1,
  left: 2,
  right: 3,
  down: 4
};

function oppositeDirection(direction) {
  switch (direction) {
    case directions.none:
      return directions.none;
    case directions.up:
      return directions.down;
    case directions.left:
      return directions.right;
    case directions.right:
      return directions.left;
    case directions.down:
      return directions.up;
  }
}

const allDirections = [ directions.up, directions.left, directions.right, directions.down ];

function directionToDxDy(direction) {
    let dx = 0;
    let dy = 0;
    switch (direction) {
      case directions.up:
        dy = -1;
        break;
      case directions.left:
        dx = -1;
        break;
      case directions.right:
        dx = +1;
        break;
      case directions.down:
        dy = +1;
        break;
    }
    return { dx, dy };  
}

class Cell {
  constructor(maze, row, col) {
    this.maze = maze;
    this.row = row;
    this.col = col;
    this.mark = 0;
    this.isEntrance = false;
    this.isExit = false;
    this.openWalls = new Set();
  }

  canGo(direction) {
    return this.openWalls.has(direction);
  }

  get isInMaze() {
    return this.row >= 0 && 
    this.row < this.maze.height &&
    this.col >= 0 &&
    this.col < this.maze.width;
  }

  go(direction) {
    const { dx, dy } = directionToDxDy(direction);
    return this.maze.cell(this.row + dy, this.col + dx);
  }

  *neighbors() {
    for(let direction of this.openWalls) {
      yield this.go(direction);
    }
  }

  openWall(direction) {
    let neighbor = this.go(direction);
    if (neighbor.isInMaze) {
      this.openWalls.add(direction);
      neighbor.openWalls.add(oppositeDirection(direction));
    }
  }

  closeWall(direction) {
    this.openWalls.delete(direction);
  }
}

class Maze {

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.outOfMazeCell = new Cell(this, -1, -1);

    this.cells = [];
    for (let row = 0; row < height; ++row) {
      let cellRow = [];
      this.cells.push(cellRow);
      for (let col = 0; col < width; ++col) {
        cellRow.push(new Cell(this, row, col));
      }
    }
  }

  cell(row, col) {
    if (row < 0 || row >= this.height || col < 0 || col >= this.width) {
      return this.outOfMazeCell;
    }
    return this.cells[row][col];
  }

  entrance() {
    for(let row of this.cells) {
      if (row[0].isEntrance) {
        return row[0];
      }
    }
  }

  exit() {
    for(let row of this.cells) {
      if(row[row.length - 1].isExit) {
        return row[row.length - 1];
      }
    }
  }
  
  *allCells() {
    for(let row of this.cells) {
      for(let cell of row) {
        yield cell;
      }
    }
  }

  rows() {
    return this.cells;
  }

  row(rowNum) {
    return this.cells[rowNum];
  }
}

Object.assign(exports, { directions, oppositeDirection, allDirections, Cell, Maze });
