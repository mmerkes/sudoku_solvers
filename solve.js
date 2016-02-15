// solve.js
var solver = require('./sudoku_solver');
var board = "";

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  var chunk = process.stdin.read();

  if (chunk !== null) {
    board += chunk.replace(/,/g, "").replace(/-/g, "0")
  }
});

process.stdin.on('end', () => {
  var solution = solver.solveSudoku(board);
});

