'use strict';

const argv = require('minimist')(process.argv.slice(2));
const { Maze } = require('./src/maze');
const { makeMaze } = require('./src/maze-maker');
const { makePrinter, asciiCharSet, unicodeCharSet } = require('./src/maze-printer');
const { solveMaze, isSolutionCell } = require('./src/maze-solver');

argv.w = argv.w || 20;
argv.h = argv.h || 20;
const charSet = argv.a ? asciiCharSet : unicodeCharSet;

let maze = makeMaze(argv.w, argv.h);
solveMaze(maze);
let printMaze = makePrinter(isSolutionCell, charSet);
printMaze(maze);
