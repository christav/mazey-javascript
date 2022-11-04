'use strict';

const { directions } = require('./maze');

const unicodeCharSet = {
  corners: [
    ' ',
    '╹',
    '╺',
    '┗',
    '╻',
    '┃',
    '┏',
    '┣',
    '╸',
    '┛',
    '━',
    '┻',
    '┓',
    '┫',
    '┳',
    '╋'
  ],

  solutionChars: [
    '   ',
    '   ',
    '   ',
    ' ╰┄',
    '   ',
    ' ┆ ',
    ' ╭┄',
    '   ',
    '   ',
    '┄╯ ',
    '┄┄┄',
    '   ',
    '┄╮ ',
    '   ',
    '   ',
    '   '    
  ]
};

const asciiCharSet = {
  corners: [
    ' ',
    '+',
    '+',
    '+',
    '+',
    '|',
    '+',
    '+',
    '+',
    '+',
    '-',
    '+',
    '+',
    '+',
    '+',
    '+'    
  ],

  solutionChars: [
    '   ',
    '   ',
    '   ',
    'XXX',
    '   ',
    'XXX',
    'XXX',
    '   ',
    '   ',
    'XXX',
    'XXX',
    '   ',
    'XXX',
    '   ',
    '   ',
    '   '    
  ]
};

function makePrinter(isSolutionCell, charSet = unicodeCharSet, writeLine = console.log) {

  const horizontalBar = `${charSet.corners[10]}${charSet.corners[10]}${charSet.corners[10]}`;

  // Figure out what corner character to print
  // when printing the separator line between two rows
  function cornerChar(cell) {
    let index = 0;
    index |= cell.go(directions.up).isEntrance || cell.go(directions.up).canGo(directions.left) ? 0 : 1;
    index |= cell.canGo(directions.up) ? 0 : 2;
    index |= cell.isEntrance || cell.canGo(directions.left) ? 0 : 4;
    index |= cell.go(directions.left).canGo(directions.up) ? 0 : 8;

    if (cell.row === 0)
    {
        index &= 0xe;
    }
    if (cell.col === 0)
    {
        index &= 0x7;
    }

    return charSet.corners[index];
  }

  // Figure out what characters to print in each cell
  // when writing out the solution path
  function cellContents(cell)
  {
      if (!isSolutionCell(cell))
      {
          return "   ";
      }
      let index = 0;
      index |= cell.canGo(directions.up) && isSolutionCell(cell.go(directions.up)) ? 1 : 0;
      index |= cell.isExit || cell.canGo(directions.right) && isSolutionCell(cell.go(directions.right)) ? 2 : 0;
      index |= cell.canGo(directions.down) && isSolutionCell(cell.go(directions.down)) ? 4 : 0;
      index |= cell.isEntrance || cell.canGo(directions.left) && isSolutionCell(cell.go(directions.left)) ? 8 : 0;
      return charSet.solutionChars[index];
  }

  // Given a row, figure out what character to print at the end
  function rowSeparatorEnd(row) {
    let cell = row[row.length - 1];
    let index = 0;
    index |= cell.go(directions.up).isExit ? 0 : 1;
    index |= cell.isExit ? 0 : 4;
    index |= cell.canGo(directions.up) ?  0 : 8;

    if (cell.row === 0)
    {
        index &= 0xe;
    }
    return charSet.corners[index];
  }

  // Print the line separating two rows of cells
  function printRowSeparator(row) {
    let line = "";
    for (let cell of row) {
      line += cornerChar(cell);
      if (cell.canGo(directions.up)) {
        if (isSolutionCell(cell) && isSolutionCell(cell.go(directions.up))) {
          line += charSet.solutionChars[5];
        } else {
          line += '   ';
        }
      } else {
        line += horizontalBar;
      }
    }
    line += rowSeparatorEnd(row);
    writeLine(line);
  }

  // Print a row of cells
  function printRow(row) {
    let line = '';
    for (let cell of row) {
      if (cell.isEntrance) {
        if (isSolutionCell(cell)) {
          line += charSet.solutionChars[10][1];
        } else {
          line += ' ';
        }
      } else if (cell.canGo(directions.left)) {
        if (isSolutionCell(cell) && isSolutionCell(cell.go(directions.left))) {
          line += charSet.solutionChars[10][1];
        } else {
          line += ' ';
        }
      } else {
        line += charSet.corners[5];
      }
      line += cellContents(cell);
    }

    let lastCell = row[row.length - 1];
    if (lastCell.isExit) {
      if (isSolutionCell(lastCell)) {
        line += charSet.solutionChars[10][1];
      } else {
        line += ' ';
      }
    } else {
      line += charSet.corners[5];
    }
    writeLine(line); 
  }

  // Print the bottom line of the maze
  function printMazeBottom(maze) {
    let line = '';
    for(let cell of maze.row(maze.height - 1)) {
      let index = 0xa | (cell.canGo(directions.left) ? 0 : 1);
      if (cell.col === 0) {
        index &= 0x7;
      }
      line += charSet.corners[index] + horizontalBar;
    }

    // Figure out bottom right character - depends on if exit is
    // on the last row or not
    let lastCell = maze.cell(maze.height - 1, maze.width - 1);
    let index = 0x8 | (lastCell.canGo(directions.right) ? 0 : 1);
    line += charSet.corners[index];

    writeLine(line);
  }

  return function printMaze(maze, isSolutionCell, charSet = unicodeCharSet, writeLine = console.log) {
    for (let row of maze.rows()) {
      printRowSeparator(row, charSet, writeLine);
      printRow(row, charSet, isSolutionCell);
    }
    printMazeBottom(maze);
  }
}

module.exports = { makePrinter, unicodeCharSet, asciiCharSet };
