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
      getRandPosible: function(arr1,arr2,arr3) {
        if (arr1.length > 9 || arr2.length > 9 || arr3.length > 9) {
          return false;
        }

        let notAcceptableValues = [];
        var vm = this;
        notAcceptableValues.concat(arr1,arr2,arr3).forEach(function(item) {
          if (!notAcceptableValues.includes(item) && vm.posibleNumbers.includes(item)) {
            notAcceptableValues.push(item);
          }
        });

        if(notAcceptableValues.length == this.posibleNumbers.length) {
          return false;
        }
        else {
          let gotIt = false;
          let rnd;
          while (!gotIt) {
            rnd = Math.floor(Math.random(0,1) * 9)+1;
            if (!notAcceptableValues.includes(rnd)) {
              gotIt = true;
            }
          }
          return rnd;
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
      fillMatrixRand: function() {
        this.fillMatrixZeros(); // fill the matrix with zeros

        for (var x = 0; x < 9; x++) {
          for (var y = 0; y < 9; y++) {
            let subMatrixPos = this.getSubMatrixPos(x+1,y+1);
            let subMatrixNumbers = this.getSubMatrixNumbers(subMatrixPos.x,subMatrixPos.y);
            let xNumbers = this.getXNumbers(y+1);
            let yNumbers = this.getYNumbers(x+1);
            var rndValue = this.getRandPosible(subMatrixNumbers,xNumbers,yNumbers);
            if (rndValue) {
              this.matrix[x][y] = rndValue;
            }
            else {
              this.matrix[x][y] = -1; // IF THERE ARE -1s ON THE MATRIX THEN THIS FAILED
            }
          }// for
        }// for
      }// fillMatrixRand
    }
  }
</script>

<style>
</style>
