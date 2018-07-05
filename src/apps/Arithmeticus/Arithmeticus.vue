<template>
  <div>
    <div class="d-flex justify-content-between align-items-start">
      <div class="pt-2 pb-2">
        <h2>Arithmeticus!</h2>
      </div>
      <div>
        <div v-show="secondsLeft > 0" class="d-flex justify-content-between align-items-center">
          <span class="d-none d-sm-inline-block">Seconds left: </span>
          <span class="badge badge-primary badge-pill">{{ secondsLeft }}</span>
        </div>
        <div v-show="correctCount > 0 && !finished" class="d-flex justify-content-between align-items-center">
          <span class="d-none d-sm-inline-block">Corrects: </span>
          <span class="badge badge-success badge-pill">{{ correctCount }}</span>
        </div>
      </div>
    </div>
    <div v-if="!finished && !running" class="alert alert-info">
      Solve the problem as fast as posible.
    </div>
    <div v-show="running" class="text-center">
      <h4>{{ numberA }} {{ operation }} {{ numberB }}</h4>
    </div>
    <div v-show="running" class="text-center">
      Your response: <input type="number"
                            v-on:keyup.13="submitValue"
                            ref="yourResponse"
                            v-model="yourResponse"
                            id="yourResponse">
      <button class="btn btn-primary" @click="submitValue">
        <i class="fas fa-check-circle"></i>
        <span class="d-none d-sm-inline-block">Submit</span>
      </button>
    </div>
    <transition name="fade">
      <div v-if="wrong && !finished" class="alert alert-danger mt-4">
        You are wrong! Try again.
      </div>
    </transition>
    <transition name="fade">
      <div v-if="finished" class="alert alert-success">
        Time is over! Your score is: <strong>{{ correctCount }}</strong>.
      </div>
    </transition>
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
        numberA: 0,
        numberB: 0,
        operation: '+',
        operationCode: 1,
        correct: false,
        wrong: false,
        timer: null,
        secondsLeft: 60,
        secondsTotal: 60,
        running: false,
        finished: false,
        correctCount: 0,
        yourResponse: ''
      }
    },
    methods: {
      submitValue: function() {
        let response = this.yourResponse;
        switch (this.operationCode) {
          case 1:
            if (this.numberA + this.numberB == response) {
              this.correct = true;
            }
            else {
              this.wrong = true;
            }
          break;
          case 2:
            if (this.numberA - this.numberB == response) {
              this.correct = true;
            }
            else {
              this.wrong = true;
            }
          break;
          case 3:
            if (this.numberA * this.numberB == response) {
              this.correct = true;
            }
            else {
              this.wrong = true;
            }
          break;
        }
        if (this.correct) {
          this.correctCount++;
          this.newOperation();
        } else { // Wrong!
          this.yourResponse = "";
          this.$refs.yourResponse.focus();
        }
      },
      start: function() {
        this.secondsLeft = this.secondsTotal;
        var vm = this;
        this.timer = setInterval(function(){
          vm.secondsLeft -= 1;
          console.log('tick '+vm.secondsLeft);
          if (vm.secondsLeft == 0) {
            console.log('stop');
            vm.stop();
          }
        },1000);
        this.correctCount = 0;
        this.running = true;
        this.finished = false;
        this.newOperation();
      },
      stop: function(){
        clearInterval(this.timer);
        this.running = false;
        this.finished = true;
      },
      newOperation: function() {
        this.correct = false;
        this.wrong = false;
        this.numberA = this.getRandomNumber();
        this.numberB = this.getRandomNumber();
        this.operation = this.getRandomOperation();
        this.yourResponse = '';

        // I don't know why it takes a while for the dom to update
        // so i can't focus the input right away, thus i'll wait 10 milliseconds
        // TODO: investigate on this, and find a better solution
        var vm = this;
        setTimeout(function(){
          vm.$refs.yourResponse.focus();
        },10);
      },
      getRandomNumber: function() {
        return Math.floor(Math.random() * 10) + 1;
      },
      getRandomOperation: function() {
        this.operationCode = Math.floor(Math.random() * 3) + 1;
        switch (this.operationCode) {
          case 1: return '+';
          break;
          case 2: return '-';
          break;
          case 3: return '*';
          break;
        }
      }
    },
    mounted: function() {
      //this.start();
    }
  }
</script>

<style scoped>
  @import "../../styles/animations.scss";

  input#yourResponse {
    width: 40px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      /* display: none; <- Crashes Chrome on hover */
      -webkit-appearance: none;
      margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
</style>
