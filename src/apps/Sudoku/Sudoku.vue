<template>
  <div>
    <h2>Sudoku!</h2>
    <button class="btn btn-primary"
            @click="fillMatrix">Generate Sudoku</button>
    <table class="sudokuPuzzle mt-4">
      <tr v-for="row in matrix">
        <td v-for="td in row" v-html="$options.filters.zerosToInput(td)"></td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        matrix: [],
        posibleNumbers: [1,2,3,4,5,6,7,8,9]
      }
    },
    methods: {
      getAcceptableValues: function(arr1,arr2,arr3) {
        let notAcceptableValues = [];
        // merge the 3 received arrays on notAcceptableValues
        var vm = this;
        notAcceptableValues.concat(arr1,arr2,arr3).forEach(function(item) {
          if (!notAcceptableValues.includes(item) && vm.posibleNumbers.includes(item)) {
            notAcceptableValues.push(item);
          }
        });

        let acceptableValues = [];
        // push the values from this.posibleNumbers to acceptableValues
        // filtering those which are contained in notAcceptableValues
        vm.posibleNumbers.forEach(function(item) {
          if (!notAcceptableValues.includes(item)) {
            acceptableValues.push(item);
          }
        });

        return acceptableValues;
      },
      getRandPosible: function(acceptableValues) {
        if(acceptableValues.length < 1 || acceptableValues.length > 9) {
          return false;
        }
        else {
          // return a random value from the array given
          let rnd = Math.floor(Math.random(0,1) * acceptableValues.length);
          return acceptableValues[rnd];
        }
      },
      getShuffledPosibleNumbers: function(posibleNumbersParam) {
        // returns an array with the same values of the array given but shuffled
        let shuffledArr = [];
        let posibleNumbers = posibleNumbersParam.slice(); // clone the array
        let n = posibleNumbers.length;
        for (var i = 0;i < n; i++) {
          let rnd = this.getRandPosible(posibleNumbers);
          shuffledArr.push(rnd);
          posibleNumbers.splice(posibleNumbers.indexOf(rnd),1); // remove the value
        }
        return shuffledArr;
      },
      getSubMatrixPos: function(mx,my) {
        if (mx > 0 && mx < 10 && my > 0 && my < 10) {
          let obj = { x:0, y:0, subx:0, suby:0 };
          obj.x = Math.ceil(mx/3);
          obj.y = Math.ceil(my/3);

          if (mx >= 7 && mx <= 9) {
            obj.subx = mx-6;
          }
          else if (mx >= 4 && mx <= 6) {
            obj.subx = mx-3;
          }
          else {
            obj.subx = mx;
          }

          if (my >= 7 && my <= 9) {
            obj.suby = my-6;
          }
          else if (my >= 4 && my <= 6) {
            obj.suby = my-3;
          }
          else {
            obj.suby = my;
          }

          return obj;
        }
        else {
          return false;
        }
      },
      getSubMatrixNumbers: function(x,y) {
        if (x > 0 && x < 10 && y > 0 && y < 10) {
          let xn = 0;
          let yn = 0;

          if (x == 3) xn = 6;
          else if (x == 2) xn = 3;

          if (y == 3) yn = 6;
          else if (y == 2) yn = 3;

          let numbers = [];
          for (var j = 0; j < 3; j++) {
            for (var i = 0; i < 3; i++) {
              if (this.matrix[j+xn][i+yn] != 0) {
                numbers.push(this.matrix[j+xn][i+yn]);
              }
            }
          }
          return numbers;
        }
        else {
          return false;
        }
      },
      getXNumbers: function(y) {
        if (y > 0 && y < 10) {
          let numbers = [];
          for (var i = 0; i < 9; i++) {
            if (this.matrix[i][y-1] != 0) {
              numbers.push(this.matrix[i][y-1]);
            }
          }
          return numbers;
        }
        else {
          return false;
        }
      },
      getYNumbers: function(x) {
        if (x > 0 && x < 10) {
          let numbers = [];
          for (var i = 0; i < 9; i++) {
            if (this.matrix[x-1][i] != 0) {
              numbers.push(this.matrix[x-1][i]);
            }
          }
          return numbers;
        }
        else {
          return false;
        }
      },
      fillMatrixWithZeros: function() {
        for (var x = 0; x < 9; x++) {
          //this.matrix[x] = [];
          this.matrix.splice(x, 1, []);
          for (var y = 0; y < 9; y++) {
            //this.matrix[x][y] = 0;
            this.matrix[x].splice(y, 1, 0);
          }
        }
      },
      fillMatrixRandRecursive: function(x,y) {
        if (y == 9) { // the matrix is completed, we are done
          return true;
        }

        // if the element is already set, we go to the next one
        if (this.matrix[x][y] != 0) {
          if (x == 8) { // advance on the Y axis
            if (this.fillMatrixRandRecursive(0,y+1)) return true;
          }
          else { // advance on the X axis
            if (this.fillMatrixRandRecursive(x+1,y)) return true;
          }
          return false;
        }

        // we get an array of posible numbers to try
        let rands = this.getShuffledPosibleNumbers(this.posibleNumbers);

        for (var i=0; i<rands.length; i++) {
          let rnd = rands[i]; // random number to try

          let subMatrixPos = this.getSubMatrixPos(x+1,y+1);
          // array of numbers on the submatrix
          let subMatrixNumbers = this.getSubMatrixNumbers(subMatrixPos.x,subMatrixPos.y);

          // array of numbers on the X axis
          let xNumbers = this.getXNumbers(y+1);

          // array of numbers on the Y axis
          let yNumbers = this.getYNumbers(x+1);

          // array of values which would be accepted to be filled in this position
          let acceptableValues = this.getAcceptableValues(subMatrixNumbers,xNumbers,yNumbers);

          // check if the rand number is in the list of accepted values
          if (acceptableValues.indexOf(rnd) != -1) {

            //this.matrix[x][y] = rnd;
            this.matrix[x].splice(y, 1, rnd); // we fill this position with the rand number

            if (x == 8) { // advance on the Y axis
              if (this.fillMatrixRandRecursive(0,y+1)) return true;
            }
            else { // advance on the X axis
              if (this.fillMatrixRandRecursive(x+1,y)) return true;
            }

            // if we reach this point it means that we going back
            this.matrix[x][y] = 0; // reset this position to 0
          }
        }

        return false;
      },
      dropSomeZerosOnMatrix: function() { // drop some zeros at random places of the matrix
        for (var x = 0; x < 9; x++) {
          for (var y = 0; y < 9; y++) {
            let doIt = Math.floor(Math.random(0,1)*2); // 0 or 1
            if (doIt) {
              //this.matrix[x][y] = 0;
              this.matrix[x].splice(y, 1, 0);
            }
          }
        }
      },
      fillMatrix: function() {
        this.fillMatrixWithZeros(); // fill the matrix with zeros
        // I fill the matrix with zeros first because otherwise it breaks
        this.fillMatrixRandRecursive(0,0); // fill the matrix with rand numbers abiding the Sudoku rules

        this.dropSomeZerosOnMatrix(); // drop some zeros at random places of the matrix
      }
    },
    filters: {
      zerosToInput: function(value) {
        if (value == 0){
          return '<input type="text" maxlength="1" style="text-align:center;width:30px;border:1px solid lightgray;background-color:transparent">';
        }
        else {
          return value;
        }
      }
    }
  }
</script>

<style scoped>
  .sudokuPuzzle td {
    border: 1px solid #999;
    text-align:center;
  }

  .sudokuPuzzle {
    border: 2px solid black;
  }
  .sudokuPuzzle td:nth-child(3), .sudokuPuzzle td:nth-child(6) {
    border-right: 2px solid black;
  }

  .sudokuPuzzle tr:nth-child(3) td, .sudokuPuzzle tr:nth-child(6) td {
    border-bottom: 2px solid black;
  }
</style>
