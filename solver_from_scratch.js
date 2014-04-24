/*
  EASY
  EXPECTED INPUT
    '090000006\n' + 
    '000960485\n' +
    '000581000\n' +
    '004000000\n' +
    '517200900\n' +
    '602000370\n' +
    '100804020\n' +
    '706000810\n' +
    '300090000';
  
  EXPECTED OUTPUT
    '895742136\n' +
    '271963485\n' +
    '463581792\n' +
    '934617258\n' +
    '517238964\n' +
    '682459371\n' +
    '159874623\n' +
    '746325819\n' +
    '328196547';

  HARD
  EXPECTED INPUT
    '040001000\n' +
    '630080100\n' +
    '000790050\n' +
    '003000028\n' +
    '500040009\n' +
    '190000700\n' +
    '060058000\n' +
    '009020035\n' +
    '000900040';

  FIENDISH
  EXPECTED INPUT
    '006008500\n' +
    '000070613\n' +
    '000000009\n' +
    '000090001\n' +
    '001000800\n' +
    '400530000\n' +
    '107053000\n' +
    '050064000\n' +
    '300100060';

  EXPECTED OUTPUT
    '296318574\n' +
    '584972613\n' +
    '713645289\n' +
    '625897341\n' +
    '931426857\n' +
    '478531926\n' +
    '167253498\n' +
    '859764132\n' +
    '342189765\n';
*/

function resetBoard() {
  var grid = '090000006\n' + 
  '000960485\n' +
  '000581000\n' +
  '004000000\n' +
  '517200900\n' +
  '602000370\n' +
  '100804020\n' +
  '706000810\n' +
  '300090000';

  return parseBoard(grid);
};

function parseBoard(board) {
  return board.split('\n').map(function(row) {
    return row.split('').map(function(num) {
      return +num;
    });
  });
};

function saveEmptyPositions(board) {
  var emptyPositions = [];

  for(var i = 0; i < board.length; i++) {
    for(var j = 0; j < board[i].length; j++) {
      if(board[i][j] === 0) {
        emptyPositions.push([i, j]);
      }
    }
  }

  return emptyPositions;
};

function checkRow(board, position, value) {
  for(var i = 0; i < board[position].length; i++) {
    if(board[position][i] == value) {
      return false;
    }
  }
  return true;
};

function checkColumn(board, position, value) {
  for(var i = 0; i < board.length; i++) {
    if(board[i][position] == value) {
      return false;
    }
  }
  return true;
};

function checkSquare(board, x, y, value) {
  var squareSize = [board[0].length / 3, board.length / 3];
  var xCorner = 0;
  var yCorner = 0;



  while(x >= xCorner + squareSize[0]) {
    xCorner += squareSize[0];
  }

  while(y >= yCorner + squareSize[1]) {
    yCorner += squareSize[1];
  }

  for(var i = yCorner; i < yCorner + squareSize[1]; i++) {
    for(var j = xCorner; j < xCorner + squareSize[0]; j++) {
      if(board[i][j] == value) {        return false;
      }
    }
  }
  return true;
};

function checkValue(board, x, y, value) {
  if(checkRow(board, y, value) &&
    checkColumn(board, x, value) &&
    checkSquare(board, x, y, value)) {
    return true;
  } else {
    return false;
  }
};

function solvePuzzle(board, emptyPositions) {
  var limit = board.length / 3 * board[0].length / 3;
  for(var i = 0; i < emptyPositions.length;) {
    var y = emptyPositions[i][0];
    var x = emptyPositions[i][1];
    var value = board[y][x] + 1;
    var found = false;
    while(!found && value <= limit) {
      if(checkValue(board, x, y, value)) {
        found = true;
        board[y][x] = value;
        i++;
      } else {
        value++;
      }
    }
    if(!found) {
      board[y][x] = 0;
      i--;
    }
  }
  board.forEach(function(row) {
    console.log(row.join());
  });
  return board;
};

function solveSudoku(board) {
  var parsedBoard = parseBoard(board);
  var trackedPositions = saveEmptyPositions(parsedBoard);

  return solvePuzzle(parsedBoard, trackedPositions);
};





