<template>
  <div>
    <h2>Sudoku!</h2>
    <div v-if="!running" class="text-center">
      <button class="btn btn-primary" @click="start">
        <i class="fas fa-play-circle"></i>
        Start <template v-if="finished">again</template>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        running: false,
        finished: false,
        matrix: [],
        posibleNumbers: [1,2,3,4,5,6,7,8,9]
      }
    },
    methods: {
      start: function() {
        this.running = true;
        this.finished = false;
      },
      stop: function() {
        this.running = false;
        this.finished = true;
      },
      getAcceptableValues: function(arr1,arr2,arr3) {
        let notAcceptableValues = [];
        var vm = this;
        notAcceptableValues.concat(arr1,arr2,arr3).forEach(function(item) {
          if (!notAcceptableValues.includes(item) && vm.posibleNumbers.includes(item)) {
            notAcceptableValues.push(item);
          }
        });

        let acceptableValues = [];
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
          let rnd = Math.floor(Math.random(0,1) * acceptableValues.length);
          return acceptableValues[rnd];
        }
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
      fillMatrixZeros: function() {
        for (var x = 0; x < 9; x++) {
          this.matrix[x] = [];
          for (var y = 0; y < 9; y++) {
            this.matrix[x][y] = 0;
          }
        }
      },
      fillMatrixRandRecursive: function(x,y) {
        if (y == 9) { // the matrix is completed, we are done
          console.log('We are done.');
          return true;
        }
        else { // if not, we put a number and continue
          if (this.matrix[x][y] != 0) {
            if (x < 8) {
              if (this.fillMatrixRandRecursive(x+1,y)) {
                return true;
              }
            }
            else {
              if (this.fillMatrixRandRecursive(0,y+1)) {
                return true;
              }
            }
          }
          else {
            let rands = this.posibleNumbers;
            var vm = this;
            rands.forEach(function(rnd) {
              let subMatrixPos = vm.getSubMatrixPos(x+1,y+1);
              let subMatrixNumbers = vm.getSubMatrixNumbers(subMatrixPos.x,subMatrixPos.y);
              let xNumbers = vm.getXNumbers(y+1);
              let yNumbers = vm.getYNumbers(x+1);
              let acceptableValues = vm.getAcceptableValues(subMatrixNumbers,xNumbers,yNumbers);
              if (acceptableValues.indexOf(rnd) != -1) { // the rand numbers is valid
                vm.matrix[x][y] = rnd;
                /////////////////////////////////////////////
                console.log('=== rnd:'+rnd+' acceptableValues:'+acceptableValues);
                console.log("===================================");
                console.log('Called with coordinates x:'+x+' y:'+y);
                // output Matrix to console
                for (var k = 0; k < 9; k++) {
                  console.log(vm.matrix[k]);
                }
                /////////////////////////////////////////////
                if (x < 8) {
                  if (vm.fillMatrixRandRecursive(x+1,y)) {
                    return true;
                  }
                  else {
                    vm.matrix[x][y] = 0;
                  }
                }
                else {
                  if (vm.fillMatrixRandRecursive(0,y+1)) {
                    return true;
                  }
                  else {
                    vm.matrix[x][y] = 0;
                  }
                }
              }
            });
          }

          return false;
        }
      },// fillMatrixRandRecursive
      fillMatrix: function() {
        this.fillMatrixZeros(); // fill the matrix with zeros
        // I fill the matrix with zeros first because otherwise it breaks
        this.fillMatrixRandRecursive(); // fill the matrix with rand numbers abiding the Sudoku rules
      },
      checkFilledMatrix: function() {
        var hasOnlyGoodNumbers = true;
        for (var j = 0; j < 9; j++) {
          for (var i = 0; i < 9; i++) {
            if (!(this.matrix[j][i] >= 1 && this.matrix[j][i] <= 9)) {
              hasOnlyGoodNumbers = false;
            }
          }
        }
        return hasOnlyGoodNumbers;
      }
    }
  }
</script>

<style>
</style>
