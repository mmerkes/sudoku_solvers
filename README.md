#Sudoku Solver from Scratch in JavaScript (TDD Style): A Tutorial

As a JS noob, it can be tough to come up with ideas to practice your skills, but at NOOBjs, we've got you in mind with our noob-first design philosophy, so we have a little project for you.

We've all played sudoku. Maybe you enjoy it, or maybe you really don't, but you feel offended by its incompleteness in the in-flight magazine. Either way, the puzzle must be solved! Sometimes you don't want to bother, but just copying the solution is not very satisfying. However, it's not really cheating if you write an app that does the heavy lifting, is it? That's what we're setting out to do today - write a sudoku solver from scratch in JavaScript. Oh, and why don't we do it [TDD](http://en.wikipedia.org/wiki/Test-driven_development) style? Don't worry, the solver should be so simple that a noob should be able to follow! No promises...

The goal of this tutorial is to walk you through writing a sudoku solver in JavaScript, so I will not go into detail regarding the testing tools, but you should be able to get the idea of how everything is working. It won't be the fastest solver out there, but it will get the job done.

##Our Algorithm

The most basic way I could think of to write a sudoku solver is to start at the first empty square, try a number, and check the row, column and nearest 3x3 square for a match. If there is no match, the number is currently valid, so move to the next square and try a new number. If you try numbers 1-9 and find no valid numbers, go back to the previous square and increment it by one until you either exceeded 9 or you find a new possible valid number. Keep following this same plan, sliding forward and backwards through the empty squares until you arrive at a solution.

This is a [backtracking](http://en.wikipedia.org/wiki/Backtracking) algorithm. The basic idea being that you incrementally build a solution and discard it once you realize that it's not viable.

For now, let's create a simple Node.js application that tests puzzles with the following format:

    var board = '090000006\n' + 
                '000960485\n' +
                '000581000\n' +
                '004000000\n' +
                '517200900\n' +
                '602000370\n' +
                '100804020\n' +
                '706000810\n' +
                '300090000';

As you can see, we have one long string where each row is separated by newline characters, '\n', and all of the empty squares are represented by zeros. 

##The Functions

In order to create this sudoku solver, I see the following functions that we need to write:

1. `parseBoard`: parse the string into a 2D array and convert strings to integers for easier manipulation

2. `saveEmptyPositions`: iterate through the board and save all of the empty positions into an array so we can track which numbers are mutable and keep order to our testing

3. `checkRow`, `checkColumn`, `check3x3Square`, `checkValue`: check the column, row and current 3x3 square for a match to the current value tested, which can all be called with `checkValue`

4. `solvePuzzle`: take the parsed sudoku board, the array of empty positions, and find the solution

5. `solveSudoku`: parse the board, save the empty positions, and pass them to `solvePuzzle`

##Getting Started

Create a new directory to begin the project and navigate to that directory.

##Our Testing Suite

In order to run the tests involved in this project, you will need Node.js installed. For the testing suite, we're going to use [Mocha](http://visionmedia.github.io/mocha/) and [Chai](http://chaijs.com/) for assertions, which can both be installed via NPM.

Mocha must be installed globally:

    $ npm install -g mocha

Chai can be installed locally:

    $ npm install chai

##Our First Test

Time to begin the fun! Let's set up our file and write our first `describe` statement:

    // sudoku_solver_spec.js
    var Chai = require('chai'),
        expect = Chai.expect,
        solver = require('./sudoku_solver');

    describe('Sudoku Solver', function() {
      // all tests should be inserted here
    });

So far, we're not actually doing anything. We're just setting the stage. Looking at our roadmap above, we need to first write a function that parses the sudoku board input. Here's the test:

    // sudoku_solver_spec.js
    var board = '090000006\n' + 
                '000960485\n' +
                '000581000\n' +
                '004000000\n' +
                '517200900\n' +
                '602000370\n' +
                '100804020\n' +
                '706000810\n' +
                '300090000';
    var parsedBoard;

    describe('#parseBoard()', function() {
      it('should parse a sudoku board into a 2D array', function() {
        parsedBoard = parseBoard(board);
        var expectedBoard = [
          [0,9,0,0,0,0,0,0,6],
          [0,0,0,9,6,0,4,8,5],
          [0,0,0,5,8,1,0,0,0],
          [0,0,4,0,0,0,0,0,0],
          [5,1,7,2,0,0,9,0,0],
          [6,0,2,0,0,0,3,7,0],
          [1,0,0,8,0,4,0,2,0],
          [7,0,6,0,0,0,8,1,0],
          [3,0,0,0,9,0,0,0,0]
        ];

        expect(parsedBoard.length).to.equal(9);
        expect(parsedBoard[0].length).to.equal(9);
        expect(parsedBoard).to.eql(expectedBoard);
      });
    });

Let's write it red:

    // sudoku_solver.js
    module.exports.parseBoard = function(board) {
      
    };

Confirm that it fails:

    $ mocha sudoku_solver_spec.js

Now, let's make it green:

    // sudoku_solver.js
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

##Collect the Empty Positions

Now that we have the board in a friendlier format, we can move to the next step where we track all of the positions that were left empty in the original board. Once we have this list, we can start iterating through all of the positions to test out integers.

`saveEmptyPositions` should find all of the zeroes in the board and push the `row, column` coordinates to an array. Let's write the test! First, define `emptyPositions` variable next to the `parsedBoard` declaration so that we can access it later. Let's write our test:

    describe('#saveEmptyPositions()', function() {
      it('should save all of the empty positions, 0s, in a parsed board', function() {
        emptyPositions = solver.saveEmptyPositions(parsedBoard);

        var expectedPositions = [
          [0,0],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,0],[1,1],
          [1,2],[1,5],[2,0],[2,1],[2,2],[2,6],[2,7],[2,8],[3,0],
          [3,1],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[4,4],[4,5],
          [4,7],[4,8],[5,1],[5,3],[5,4],[5,5],[5,8],[6,1],[6,2],
          [6,4],[6,6],[6,8],[7,1],[7,3],[7,4],[7,5],[7,8],[8,1],
          [8,2],[8,3],[8,5],[8,6],[8,7],[8,8]
        ];

        expect(emptyPositions.length).to.equal(51);
        expect(emptyPositions).to.eql(expectedPositions);
      });
    });

Write an empty `saveEmptyPositions` function and run your test again with Mocha (`mocha sudoku_solver_spec.js`). You should have one failing test. Time to write the code to make it pass!

    // sudoku_solver.js
    module.exports.saveEmptyPositions = function(board) {
      // Create an array to save the positions
      var emptyPositions = [];

      // Check every square in the puzzle for a zero
      for(var i = 0; i < board.length; i++) {
        for(var j = 0; j < board[i].length; j++) {
          // If a zero is found, save that position
          if(board[i][j] === 0) {
            emptyPositions.push([i, j]);
          }
        }
      }

      // Return the positions
      return emptyPositions;
    };

All tests should be green!

##Check the Row, Column, and 3x3 Square

Now, we have the sudoku board parsed into a 2D array, and we have all of the empty positions that we need to fill. Next, we need to write the `checkRow`, `checkColumn`, and `check3x3Square` functions to look for conflicts. When we have those three, we can combine them into the `checkValue` function to confirm the validity of a number in one call. Once we can actually check values we plug into our puzzle, we can move onto the stage of trying numbers systematically.

Starting with our `checkRow` function, we need to see if there are any conflicts with the value we're trying. Time to write our test!

    describe('#checkRow()', function() {
      it('should check that each value in the row does not equal the input', function() {
        // No match. Return true.
        expect(solver.checkRow(parsedBoard, 0, 2)).to.be.ok;
        // Match found. Return false;
        expect(solver.checkRow(parsedBoard, 0, 9)).to.not.be.ok;
      });
    });

In this test, we're expecting 2 to not be in row 0, but we expect 9 to already be in the row. Checking for this is simple. We just go through each value in the row and see if it's already in use:

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

Checking the column should work in almost the same manner. Here's our test:

    describe('#checkColumn()', function() {
      it('should check that each value in a column does not equal the input', function() {
        // No match. Return true
        expect(solver.checkColumn(parsedBoard, 0, 9)).to.be.ok;
        // Match found. Return false
        expect(solver.checkColumn(parsedBoard, 0, 5)).to.not.be.ok;
      });
    });

Verify that our test fails. Now, we can make it green:

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

The final values to check will be the 3x3 square that the value lives in. Before we can check every value in the appropriate square, we'll need to find the appropriate square to check. Let's test it:

    describe('#check3x3Square()', function() {
      it('should check that each value in a 3x3 square does not match the input', function() {
        // No match. Return true
        expect(solver.check3x3Square(parsedBoard, 2, 2, 1)).to.be.ok;
        expect(solver.check3x3Square(parsedBoard, 7, 7, 9)).to.be.ok;
        // Match found. Return false
        expect(solver.check3x3Square(parsedBoard, 2, 2, 9)).to.not.be.ok;
        expect(solver.check3x3Square(parsedBoard, 7, 7, 1)).to.not.be.ok;
      });
    });

Once we verify that we have a failing test, we can work on making the test pass. Let's figure out the bounds of the 3x3 square and test each of the values:

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

Now, we have the three functions to test all possible conflicts for a particular value, so let's wrap all of that into one function:

    describe('#checkValue()', function() {
      it('should check whether a value is valid for a particular position', function() {
        // No match. Return true
        expect(solver.checkValue(parsedBoard, 0, 0, 2)).to.be.ok;
        expect(solver.checkValue(parsedBoard, 3, 7, 3)).to.be.ok;
        // Match found. Return false
        expect(solver.checkValue(parsedBoard, 0, 0, 9)).to.not.be.ok;
        expect(solver.checkValue(parsedBoard, 3, 7, 1)).to.not.be.ok;
      });
    });

Once we check that we have a failing test, we can now combine `checkRow`, `checkColumn`, and `check3x3Square` to verify that a value is valid for a given position:

    module.exports.checkValue = function(board, column, row, value) {
      if(this.checkRow(board, row, value) &&
        this.checkColumn(board, column, value) &&
        this.check3x3Square(board, column, row, value)) {
        return true;
      } else {
        return false;
      }
    };

At this point, we have almost everything that we need to solve a sudoku puzzle. We've parsed the board, saved the empty positions, and can check for any possible conflicts given a value. Next up: solving the puzzle!

##Finding a Solution

Now that we can test values, we need to write a function that can systematically check each possible value until we find a valid value. Essentially, we need to go through each empty position that we saved in the `emptyPositions` array, try numbers 1-9 at each position until we find a valid number, and move to the next position. If no valid numbers are found at the next position, we move back a position to find a new valid number. We do this through all of the positions until we've found a whole board of valid positions, giving us our solution.

Our `solvePuzzle` function should take a parsed board and an array of empty positions and return the solution (as well as log it). Let's write our failing test:

    var expectedSolution = [[ 8,9,5,7,4,2,1,3,6 ],
                            [ 2,7,1,9,6,3,4,8,5 ],
                            [ 4,6,3,5,8,1,7,9,2 ],
                            [ 9,3,4,6,1,7,2,5,8 ],
                            [ 5,1,7,2,3,8,9,6,4 ],
                            [ 6,8,2,4,5,9,3,7,1 ],
                            [ 1,5,9,8,7,4,6,2,3 ],
                            [ 7,4,6,3,2,5,8,1,9 ],
                            [ 3,2,8,1,9,6,5,4,7 ]];

    describe('#solvePuzzle()', function() {
      it('should find a solution to the puzzle passed in', function() {
        var solution = solver.solvePuzzle(parsedBoard, emptyPositions);

        expect(solution).to.eql(expectedSolution);
      });
    });

After we verify that this test will fail, we can begin writing the code to solve our sudoku:

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
          // If a valid value is found, mark found true,
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

Now, all of our tests should be green again! And the solution should have logged:

    8,9,5,7,4,2,1,3,6
    2,7,1,9,6,3,4,8,5
    4,6,3,5,8,1,7,9,2
    9,3,4,6,1,7,2,5,8
    5,1,7,2,3,8,9,6,4
    6,8,2,4,5,9,3,7,1
    1,5,9,8,7,4,6,2,3
    7,4,6,3,2,5,8,1,9
    3,2,8,1,9,6,5,4,7

##Pull It All Together!

Finally, we have everything we need! We just need to write `solveSudoku`, which takes the original string of the sudoku board, parses the board, saves the empty positions, and runs our solver. That's it! All of this could have been handled in our `solvePuzzle` function, but I prefer to move as many individual steps out as possible. Our test is going to look just like our previous test, except that it's going to take our sudoku board string as an argument:

    describe('#solveSudoku()', function() {
      it('should find a solution to the puzzle string passed in', function() {
        var solution = solver.solveSudoku(board);

        expect(solution).to.eql(expectedSolution);
      });
    });

Once we confirm that our tests fail, we can finish this!

    module.exports.solveSudoku = function(board) {
      var parsedBoard = this.parseBoard(board);
      var emptyPositions = this.saveEmptyPositions(parsedBoard);

      return this.solvePuzzle(parsedBoard, emptyPositions);
    };

All should now be green! And that's our fully tested sudoku solver.

##What next?

The last step in TDD is refactoring, which we will save for you to do. As it stands, it solves a 'fiendish' puzzle in a few milliseconds, so we're content with the performance. However, there are a number of improvements that could be made. For example, we are manually checking every value, 1-9, whenever we test a new position no matter what. A possible improvement would be to be a little smarter about how we check values. Also, it currently does not handle the case of puzzle with no solution, nor does it handle any puzzles other than 9x9 boards.

Other ideas would be to create a better interface to input a sudoku puzzle like a command line tool, web app, etc. Feel free to submit a pull request into the `followers` folder to share your projects!

We hope you enjoyed this little hands-on tutorial.



