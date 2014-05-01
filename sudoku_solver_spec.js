// sudoku_solver_spec.js
var Chai = require('chai'),
    expect = Chai.expect,
    solver = require('./sudoku_solver');

describe('Sudoku Solver', function() {
  // all tests should be inserted here
  var board = '090000006\n' + 
              '000960485\n' +
              '000581000\n' +
              '004000000\n' +
              '517200900\n' +
              '602000370\n' +
              '100804020\n' +
              '706000810\n' +
              '300090000';
  var parsedBoard, expectedBoard, emptyPositions;

  describe('#parseBoard()', function() {
    it('should parse a sudoku board into a 2D array ' +
       ' and convert to integers', function() {
      parsedBoard = solver.parseBoard(board);
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

  describe('#checkRow()', function() {
    it('should check that each value in the row does not equal the input', function() {
      // No match. Return true.
      expect(solver.checkRow(parsedBoard, 0, 2)).to.be.ok;
      // Match found. Return false;
      expect(solver.checkRow(parsedBoard, 0, 9)).to.not.be.ok;
    });
  });

  describe('#checkColumn()', function() {
    it('should check that each value in a column does not equal the input', function() {
      // No match. Return true
      expect(solver.checkColumn(parsedBoard, 0, 9)).to.be.ok;
      // Match found. Return false
      expect(solver.checkColumn(parsedBoard, 0, 5)).to.not.be.ok;
    });
  });

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
    it('should find a solution to the puzzle array and emptyPositions passed in', function() {
      var solution = solver.solvePuzzle(parsedBoard, emptyPositions);

      expect(solution).to.eql(expectedSolution);
    });
  });

  describe('#solveSudoku()', function() {
    it('should find a solution to the puzzle string passed in', function() {
      var solution = solver.solveSudoku(board);

      expect(solution).to.eql(expectedSolution);
    });
  });
});







