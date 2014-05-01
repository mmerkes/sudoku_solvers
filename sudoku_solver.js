module.exports.parseBoard = function(board) {
  // split the board at each new line, and use map
  // to split each row into an array of characters
  return board.split('\n').map(function(row) {
    // use map to convert the characters into integers
    return row.split('').map(function(num) {
      return +num;
    });
  });
};

module.exports.saveEmptyPositions = function(board) {
  // Create an array to save the positions
  var emptyPositions = [];

  // Check every square in the puzzle for a zero
  for(var i = 0; i < board.length; i++) {
    for(var j = 0; j < board[i].length; j++) {
      // If a zero is found, so that position
      if(board[i][j] === 0) {
        emptyPositions.push([i, j]);
      }
    }
  }

  // Return the positions
  return emptyPositions;
};

module.exports.checkRow = function(board, row, value) {
  // Iterate through every value in the row
  for(var i = 0; i < board[row].length; i++) {
    // If a match is found, return false
    if(board[row][i] === value) {
      return false;
    }
  }
  // If no match was found, return true
  return true;
};

module.exports.checkColumn = function(board, column, value) {
  // Iterate through each value in the column
  for(var i = 0; i < board.length; i++) {
    // If a match is found, return false
    if(board[i][column] === value) {
      return false;
    }
  }
  // If no match was found, return true
  return true;
};

module.exports.check3x3Square = function(board, column, row, value) {
  // Save the upper left corner
  var columnCorner = 0,
      rowCorner = 0,
      squareSize = 3;

  // Find the left-most column
  while(column >= columnCorner + squareSize) {
    columnCorner += squareSize;
  }

  // Find the upper-most row
  while(row >= rowCorner + squareSize) {
    rowCorner += squareSize;
  }

  // Iterate through each row
  for(var i = rowCorner; i < rowCorner + squareSize; i++) {
    // Iterate through each column
    for(var j = columnCorner; j < columnCorner + squareSize; j++) {
      // Return false is a match is found
      if(board[i][j] === value) {        
        return false;
      }
    }
  }
  // If no match was found, return true
  return true;
};

module.exports.checkValue = function(board, column, row, value) {
  if(this.checkRow(board, row, value) &&
    this.checkColumn(board, column, value) &&
    this.check3x3Square(board, column, row, value)) {
    return true;
  } else {
    return false;
  }
};

module.exports.solvePuzzle = function(board, emptyPositions) {
  // Variables to track our position in the solver
  var limit = 9,
      i, row, column, value, found;
  for(i = 0; i < emptyPositions.length;) {
    row = emptyPositions[i][0];
    column = emptyPositions[i][1];
    // Try the next value
    value = board[row][column] + 1;
    // Was a valid number found?
    found = false;
    // Keep trying new values until either the limit
    // was reached or a valid value was found
    while(!found && value <= limit) {
      // If a valid value is found, marked found to true,
      // set the position to the value, and move to the
      // next position
      if(this.checkValue(board, column, row, value)) {
        found = true;
        board[row][column] = value;
        i++;
      } 
      // Otherwise, try the next value
      else {
        value++;
      }
    }
    // If no valid value was found and the limit was
    // reached, move back to the previous position
    if(!found) {
      board[row][column] = 0;
      i--;
    }
  }

  // A solution was found! Log it
  board.forEach(function(row) {
    console.log(row.join());
  });

  // return the solution
  return board;
};

module.exports.solveSudoku = function(board) {
  var parsedBoard = this.parseBoard(board);
  var emptyPositions = this.saveEmptyPositions(parsedBoard);

  return this.solvePuzzle(parsedBoard, emptyPositions);
};





