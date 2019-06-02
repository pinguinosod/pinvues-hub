import { mount } from '@vue/test-utils'
import Sudoku from '@/apps/Sudoku/Sudoku.vue'

let cmp;

beforeEach(() => {
  cmp = mount(Sudoku);
});

//Define the test matrix:
const testMatrix = [];
testMatrix[0] = [0,1,2,0,4,0,0,0,3];
testMatrix[1] = [4,0,0,0,1,6,0,5,2];
testMatrix[2] = [0,0,0,0,0,0,1,0,0];
testMatrix[3] = [0,0,0,0,3,0,0,0,0];
testMatrix[4] = [1,4,3,0,0,0,0,6,5];
testMatrix[5] = [0,0,0,1,0,4,0,0,0];
testMatrix[6] = [0,0,0,6,0,3,0,2,0];
testMatrix[7] = [0,0,7,0,5,0,6,0,0];
testMatrix[8] = [0,0,0,0,0,0,5,0,1];

describe('Sudoku: Initialization', () => {

  it('posibleNumbers are [1,2,3,4,5,6,7,8,9]', () => {
    expect(cmp.vm.posibleNumbers).toEqual([1,2,3,4,5,6,7,8,9]);
  });

  it('matrix is empty', () => {
    expect(cmp.vm.matrix).toEqual([]);
  });

});

describe('Sudoku: getAcceptableValues() method', () => {
  let arr1 = [1,2];
  let arr2 = [2,5,9];
  let arr3 = [1,8,9];

  it('Contains 3 4 6 7', () => {
    expect(cmp.vm.getAcceptableValues(arr1,arr2,arr3)).toEqual(expect.arrayContaining([3,4,6,7]));
  });

  it('Do not contains 1 2 5 8 9', () => {
    expect(cmp.vm.getAcceptableValues(arr1,arr2,arr3)).toEqual(expect.not.arrayContaining([1,2,5,8,9]));
  });

  it('Returns empty array if there are no options', () => {
    expect(cmp.vm.getAcceptableValues([1,2,3,4,5,6,7,8,9],arr2,arr3)).toEqual([]);
  });
});

describe('Sudoku: getRandPosible() method', () => {

  let arr1 = [1,5,6];
  let arr2 = [1,2,5,9];
  let arr3 = [4,5];
  let bigArr = [1,2,3,4,5,6,6,7,7,8,8];

  it('Only greaters than 0', () => {
    for (var i=0; i < 1000; i++) {
      expect(cmp.vm.getRandPosible(arr1)).toBeGreaterThan(0);
    }
  });

  it('Only lessers than 10', () => {
    for (var i=0; i < 1000; i++) {
      expect(cmp.vm.getRandPosible(arr2)).toBeLessThan(10);
    }
  });

  it('Only numbers contained in the array given', () => {
    for (var i=0; i < 1000; i++) {
      let rnd = cmp.vm.getRandPosible(arr2);
      expect(arr2.includes(rnd)).toBeTruthy();
    }
  });

  it('Returns false if array\'s length is greater than 9', () => {
    expect(cmp.vm.getRandPosible(bigArr)).toBeFalsy();
  });

  it('Returns false if empty array is passed', () => {
    expect(cmp.vm.getRandPosible([])).toBeFalsy();
  });

});

describe('Sudoku: getShuffledPosibleNumbers() method', () => {
  let testArr1 = [1,2,3,4];

  it('Return an array with the same length as the input array', () => {
    expect(cmp.vm.getShuffledPosibleNumbers(testArr1).length).toEqual(testArr1.length);
  });

  it('Return the same values as the input array', () => {
    expect(cmp.vm.getShuffledPosibleNumbers(testArr1)).toEqual(expect.arrayContaining(testArr1));
  });

});

describe('Sudoku: getSubMatrixPos() method', () => {
  /*
  We got a 9x9 matrix, which is grouped by 9 3x3 sub-matrices.
  Giving the coordinates of a position on the 9x9 matrix, this method should
  return the coordinates of the sub-matrix in the matrix, and the coordinates
  of the position inside the sub-matrix.

  For example: If the position on the matrix is 6,4, then the sub-matrix
  coordinates are 2,2 and inside that sub-matrix the position is 3,1.

  Position 6,4 illustrated:

    Y
      +-----+-----+-----+
    9 |0 0 0|0 0 0|0 0 0|
  3 8 |0 0 0|0 0 0|0 0 0|
    7 |0 0 0|0 0 0|0 0 0|
      +-----+-----+-----+
    6 |0 0 0|0 0 0|0 0 0|
  2 5 |0 0 0|0 0 0|0 0 0|
    4 |0 0 0|0 0 1|0 0 0|
      +-----+-----+-----+
    3 |0 0 0|0 0 0|0 0 0|
  1 2 |0 0 0|0 0 0|0 0 0|
    1 |0 0 0|0 0 0|0 0 0|
      +-----+-----+-----+
       1 2 3 4 5 6 7 8 9  X
         1     2     3

  If we input => it returns
  6,4 => 2,2|3,1
  6,3 => 2,1|3,3
  8,8 => 3,3|2,2
  1,4 => 1,2|1,1
  7,5 => 3,2|1,2
  9,9 => 3,3|3,3
  1,1 => 1,1|1,1

  Getting the coordinates of the submatrix in the matrix:
  SubN = ceil(n/3).

  Getting the coordinates of the position inside submatrix:
  If 1 <= n <= 3 then n.
  If 4 <= n <= 6 then n-3.
  If 7 <= n <= 9 then n-6.
  */

  it('1,1 => 1,1|1,1', () => {
    expect(cmp.vm.getSubMatrixPos(1,1)).toEqual({x:1,y:1,subx:1,suby:1});
  });

  it('9,9 => 3,3|3,3', () => {
    expect(cmp.vm.getSubMatrixPos(9,9)).toEqual({x:3,y:3,subx:3,suby:3});
  });

  it('6,4 => 2,2|3,1', () => {
    expect(cmp.vm.getSubMatrixPos(6,4)).toEqual({x:2,y:2,subx:3,suby:1});
  });

  it('6,3 => 2,1|3,3', () => {
    expect(cmp.vm.getSubMatrixPos(6,3)).toEqual({x:2,y:1,subx:3,suby:3});
  });

  it('8,8 => 3,3|2,2', () => {
    expect(cmp.vm.getSubMatrixPos(8,8)).toEqual({x:3,y:3,subx:2,suby:2});
  });

  it('1,4 => 1,2|1,1', () => {
    expect(cmp.vm.getSubMatrixPos(1,4)).toEqual({x:1,y:2,subx:1,suby:1});
  });

  it('7,5 => 3,2|1,2', () => {
    expect(cmp.vm.getSubMatrixPos(7,5)).toEqual({x:3,y:2,subx:1,suby:2});
  });

  it('5,2 => 2,1|2,2', () => {
    expect(cmp.vm.getSubMatrixPos(5,2)).toEqual({x:2,y:1,subx:2,suby:2});
  });

  it('4,7 => 3,2|1,2', () => {
    expect(cmp.vm.getSubMatrixPos(4,7)).toEqual({x:2,y:3,subx:1,suby:1});
  });

  it('Returns false if x is lower than 1.', () => {
    expect(cmp.vm.getSubMatrixPos(0,7)).toBeFalsy();
  });

  it('Returns false if x is negative.', () => {
    expect(cmp.vm.getSubMatrixPos(-2,7)).toBeFalsy();
  });

  it('Returns false if x is higher than 9.', () => {
    expect(cmp.vm.getSubMatrixPos(12,7)).toBeFalsy();
  });

  it('Returns false if y is lower than 1.', () => {
    expect(cmp.vm.getSubMatrixPos(7,0)).toBeFalsy();
  });

  it('Returns false if y is negative.', () => {
    expect(cmp.vm.getSubMatrixPos(7,-2)).toBeFalsy();
  });

  it('Returns false if y is higher than 9.', () => {
    expect(cmp.vm.getSubMatrixPos(7,12)).toBeFalsy();
  });
});

describe('Sudoku: getSubMatrixNumbers() method', () => {
  /*
  Returns an array of Numbers which are contained inside the sub-matrix

  For example if the matrix is like this:

    Y
      +-----+-----+-----+
    9 |3 2 0|0 5 0|0 0 1|
  3 8 |0 5 0|0 6 0|2 0 0|
    7 |0 0 1|0 0 0|0 6 5|
      +-----+-----+-----+
    6 |0 6 0|0 0 4|3 0 0|
  2 5 |4 1 0|3 0 0|0 5 0|
    4 |0 0 0|0 0 1|6 0 0|
      +-----+-----+-----+
    3 |2 0 0|0 3 0|0 7 0|
  1 2 |1 0 0|0 4 0|0 0 0|
    1 |0 4 0|0 1 0|0 0 0|
      +-----+-----+-----+
       1 2 3 4 5 6 7 8 9  X
         1     2     3

  Sub-Matrix => Numbers contained
  1,1        => [2,1,4]
  2,1        => [3,4,1]
  3,1        => [7]
  1,2        => [6,4,1]
  2,2        => [4,3,1]
  3,2        => [3,5,6]
  1,3        => [3,2,5,1]
  2,3        => [5,6]
  3,3        => [1,2,6,5]

  */

  beforeEach(() => {
    cmp.vm.matrix = testMatrix;
  });

  it('1,1 => [2,1,4]', () => {
    expect(cmp.vm.getSubMatrixNumbers(1,1)).toEqual(expect.arrayContaining([2,1,4]));
  });

  it('2,1 => [3,4,1]', () => {
    expect(cmp.vm.getSubMatrixNumbers(2,1)).toEqual(expect.arrayContaining([3,4,1]));
  });

  it('3,1 => [7]', () => {
    expect(cmp.vm.getSubMatrixNumbers(3,1)).toEqual(expect.arrayContaining([7]));
  });

  it('1,2 => [6,4,1]', () => {
    expect(cmp.vm.getSubMatrixNumbers(1,2)).toEqual(expect.arrayContaining([6,4,1]));
  });

  it('2,2 => [4,3,1]', () => {
    expect(cmp.vm.getSubMatrixNumbers(2,2)).toEqual(expect.arrayContaining([4,3,1]));
  });

  it('3,2 => [3,5,6]', () => {
    expect(cmp.vm.getSubMatrixNumbers(3,2)).toEqual(expect.arrayContaining([3,5,6]));
  });

  it('1,3 => [3,2,5,1]', () => {
    expect(cmp.vm.getSubMatrixNumbers(1,3)).toEqual(expect.arrayContaining([3,2,5,1]));
  });

  it('2,3 => [5,6]', () => {
    expect(cmp.vm.getSubMatrixNumbers(2,3)).toEqual(expect.arrayContaining([5,6]));
  });

  it('3,3 => [1,2,6,5]', () => {
    expect(cmp.vm.getSubMatrixNumbers(3,3)).toEqual(expect.arrayContaining([1,2,6,5]));
  });

  it('Returns false if x is lower than 1.', () => {
    expect(cmp.vm.getSubMatrixNumbers(0,7)).toBeFalsy();
  });

  it('Returns false if x is negative.', () => {
    expect(cmp.vm.getSubMatrixNumbers(-2,7)).toBeFalsy();
  });

  it('Returns false if x is higher than 9.', () => {
    expect(cmp.vm.getSubMatrixNumbers(12,7)).toBeFalsy();
  });

  it('Returns false if y is lower than 1.', () => {
    expect(cmp.vm.getSubMatrixNumbers(7,0)).toBeFalsy();
  });

  it('Returns false if y is negative.', () => {
    expect(cmp.vm.getSubMatrixNumbers(7,-2)).toBeFalsy();
  });

  it('Returns false if y is higher than 9.', () => {
    expect(cmp.vm.getSubMatrixNumbers(7,12)).toBeFalsy();
  });
});

describe('Sudoku: getXNumbers() method', () => {
  /*
  Giving an Y coordinate, Returns an array of Numbers
  with the numbers contained in the X axis.

  For example if the matrix is like this:

    Y
      +-----+-----+-----+
    9 |3 2 0|0 5 0|0 0 1|
  3 8 |0 5 0|0 6 0|2 0 0|
    7 |0 0 1|0 0 0|0 6 5|
      +-----+-----+-----+
    6 |0 6 0|0 0 4|3 0 0|
  2 5 |4 1 0|3 0 0|0 5 0|
    4 |0 0 0|0 0 1|6 0 0|
      +-----+-----+-----+
    3 |2 0 0|0 3 0|0 7 0|
  1 2 |1 0 0|0 4 0|0 0 0|
    1 |0 4 0|0 1 0|0 0 0|
      +-----+-----+-----+
       1 2 3 4 5 6 7 8 9  X
         1     2     3

  Y => Numbers contained
  1 => [4,1]
  2 => [1,4]
  3 => [2,3,7]
  4 => [1,6]
  5 => [4,1,3,5]
  6 => [6,4,3]
  7 => [1,6,5]
  8 => [5,6,2]
  9 => [3,2,5,1]

  */

  beforeEach(() => {
    cmp.vm.matrix = testMatrix;
  });

  it('1 => [4,1]', () => {
    expect(cmp.vm.getXNumbers(1)).toEqual(expect.arrayContaining([4,1]));
  });

  it('2 => [1,4]', () => {
    expect(cmp.vm.getXNumbers(2)).toEqual(expect.arrayContaining([1,4]));
  });

  it('3 => [2,3,7]', () => {
    expect(cmp.vm.getXNumbers(3)).toEqual(expect.arrayContaining([2,3,7]));
  });

  it('4 => [1,6]', () => {
    expect(cmp.vm.getXNumbers(4)).toEqual(expect.arrayContaining([1,6]));
  });

  it('5 => [4,1,3,5]', () => {
    expect(cmp.vm.getXNumbers(5)).toEqual(expect.arrayContaining([4,1,3,5]));
  });

  it('6 => [6,4,3]', () => {
    expect(cmp.vm.getXNumbers(6)).toEqual(expect.arrayContaining([6,4,3]));
  });

  it('7 => [1,6,5]', () => {
    expect(cmp.vm.getXNumbers(7)).toEqual(expect.arrayContaining([1,6,5]));
  });

  it('8 => [5,6,2]', () => {
    expect(cmp.vm.getXNumbers(8)).toEqual(expect.arrayContaining([5,6,2]));
  });

  it('9 => [3,2,5,1]', () => {
    expect(cmp.vm.getXNumbers(9)).toEqual(expect.arrayContaining([3,2,5,1]));
  });

  it('Returns false if y is lower than 1.', () => {
    expect(cmp.vm.getXNumbers(0)).toBeFalsy();
  });

  it('Returns false if y is negative.', () => {
    expect(cmp.vm.getXNumbers(-2)).toBeFalsy();
  });

  it('Returns false if y is higher than 9.', () => {
    expect(cmp.vm.getXNumbers(12)).toBeFalsy();
  });
});

describe('Sudoku: getYNumbers() method', () => {
  /*
  Giving an X coordinate, Returns an array of Numbers
  with the numbers contained in the Y axis.

  For example if the matrix is like this:

    Y
      +-----+-----+-----+
    9 |3 2 0|0 5 0|0 0 1|
  3 8 |0 5 0|0 6 0|2 0 0|
    7 |0 0 1|0 0 0|0 6 5|
      +-----+-----+-----+
    6 |0 6 0|0 0 4|3 0 0|
  2 5 |4 1 0|3 0 0|0 5 0|
    4 |0 0 0|0 0 1|6 0 0|
      +-----+-----+-----+
    3 |2 0 0|0 3 0|0 7 0|
  1 2 |1 0 0|0 4 0|0 0 0|
    1 |0 4 0|0 1 0|0 0 0|
      +-----+-----+-----+
       1 2 3 4 5 6 7 8 9  X
         1     2     3

  X => Numbers contained
  1 => [1,2,4,3]
  2 => [4,1,6,5,2]
  3 => [1]
  4 => [3]
  5 => [1,4,3,6,5]
  6 => [1,4]
  7 => [6,3,2]
  8 => [7,5,6]
  9 => [5,1]

  */

  beforeEach(() => {
    cmp.vm.matrix = testMatrix;
  });

  it('1 => [1,2,4,3]', () => {
    expect(cmp.vm.getYNumbers(1)).toEqual(expect.arrayContaining([1,2,4,3]));
  });

  it('2 => [4,1,6,5,2]', () => {
    expect(cmp.vm.getYNumbers(2)).toEqual(expect.arrayContaining([4,1,6,5,2]));
  });

  it('3 => [1]', () => {
    expect(cmp.vm.getYNumbers(3)).toEqual(expect.arrayContaining([1]));
  });

  it('4 => [3]', () => {
    expect(cmp.vm.getYNumbers(4)).toEqual(expect.arrayContaining([3]));
  });

  it('5 => [1,4,3,6,5]', () => {
    expect(cmp.vm.getYNumbers(5)).toEqual(expect.arrayContaining([1,4,3,6,5]));
  });

  it('6 => [1,4]', () => {
    expect(cmp.vm.getYNumbers(6)).toEqual(expect.arrayContaining([1,4]));
  });

  it('7 => [6,3,2]', () => {
    expect(cmp.vm.getYNumbers(7)).toEqual(expect.arrayContaining([6,3,2]));
  });

  it('8 => [7,5,6]', () => {
    expect(cmp.vm.getYNumbers(8)).toEqual(expect.arrayContaining([7,5,6]));
  });

  it('9 => [5,1]', () => {
    expect(cmp.vm.getYNumbers(9)).toEqual(expect.arrayContaining([5,1]));
  });

  it('Returns false if x is lower than 1.', () => {
    expect(cmp.vm.getYNumbers(0)).toBeFalsy();
  });

  it('Returns false if x is negative.', () => {
    expect(cmp.vm.getYNumbers(-2)).toBeFalsy();
  });

  it('Returns false if x is higher than 9.', () => {
    expect(cmp.vm.getYNumbers(12)).toBeFalsy();
  });
});

describe('Sudoku: fillMatrixWithZeros() method', () => {
  it('Matrix filled with zeros', () => {
    cmp.vm.fillMatrixWithZeros();
    
    for (var j = 0; j < 9; j++) {
      for (var i = 0; i < 9; i++) {
        expect(cmp.vm.matrix[j][i]).toBe(0);
      }
    }
  });

});

describe('Sudoku: fillMatrixRandRecursive() method', () => {
  it('Fully filled Matrix without zeros', () => {
    cmp.vm.fillMatrixWithZeros(); // fill the matrix with zeros
    cmp.vm.fillMatrixRandRecursive(0,0); // fill matrix with rands

    // checks if the matrix is fully filled with numbers between 1 and 9, inclusive
    for (var j = 0; j < 9; j++) {
      for (var i = 0; i < 9; i++) {
        expect(cmp.vm.matrix[j][i] >= 1 && cmp.vm.matrix[j][i] <= 9).toBeTruthy();
      }
    }
  });
});

describe('Sudoku: dropSomeZerosOnMatrix() method', () => {
  it('Fully filled Matrix with positive numbers and zeros', () => {
    cmp.vm.fillMatrixWithZeros(); // fill the matrix with zeros
    cmp.vm.fillMatrixRandRecursive(0,0); // fill matrix with rands
    cmp.vm.dropSomeZerosOnMatrix(); // drop some zeros at random places of the matrix

    // checks if the matrix is fully filled with positive numbers and zeros
    let hasZeros = false;
    let hasPositives = false;
    for (var j = 0; j < 9; j++) {
      for (var i = 0; i < 9; i++) {
        if (cmp.vm.matrix[j][i] >= 1 && cmp.vm.matrix[j][i] <= 9) {
          hasPositives = true;
        }
        else if (cmp.vm.matrix[j][i] == 0) {
          hasZeros = true;
        }
      }
    }

    expect(hasPositives).toBeTruthy();
    expect(hasZeros).toBeTruthy();
  });
});

describe('Sudoku: fillMatrix() method', () => {
  it('Fully filled Matrix with positive numbers and zeros', () => {
    cmp.vm.fillMatrix(); // fill the matrix with rands and then some zeros at random places

    // checks if the matrix is fully filled with positive numbers and zeros
    let hasZeros = false;
    let hasPositives = false;
    for (var j = 0; j < 9; j++) {
      for (var i = 0; i < 9; i++) {
        if (cmp.vm.matrix[j][i] >= 1 && cmp.vm.matrix[j][i] <= 9) {
          hasPositives = true;
        }
        else if (cmp.vm.matrix[j][i] == 0) {
          hasZeros = true;
        }
      }
    }

    expect(hasPositives).toBeTruthy();
    expect(hasZeros).toBeTruthy();
  });
});
