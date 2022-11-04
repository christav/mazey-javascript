'use strict';

const { directions, allDirections, Cell, Maze } = require('./maze');

function makeMaze(width, height) {
  let maze = new Maze(width, height);
  for(let cell of maze.allCells()) {
    cell.mark = 0;
  }

  let startRow = randInt(height);
  let startCol = randInt(width);
  let startCell = maze.cell(startRow, startCol);
  makeMazeFromCell(startCell);

  maze.cell(randInt(height), 0).isEntrance = true;
  maze.cell(randInt(height), width - 1).isExit = true;

  return maze; 
}

function makeMazeFromCell(cell) {
  cell.mark = 1;
  let neighbors = possibleNeighbors(cell);
  while(neighbors.length > 0) {
    let index = randInt(neighbors.length);
    let { direction, neighbor } = neighbors[index];
    neighbors.splice(index, 1);
    if (neighbor.mark === 0) {
      cell.openWall(direction);
      makeMazeFromCell(neighbor);
    }
  }
}

function possibleNeighbors(cell) {
  return allDirections.map(d => ({ direction: d, neighbor: cell.go(d) }))
    .filter((n) => n.neighbor.isInMaze && n.neighbor.mark === 0);
}

function randInt(maxPlusOne) {
  return Math.floor(Math.random() * maxPlusOne);
}

module.exports = { makeMaze };
