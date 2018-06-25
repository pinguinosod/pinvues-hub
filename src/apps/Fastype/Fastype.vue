<template>
  <div>
    <div class="d-flex justify-content-between align-items-start">
      <div class="pt-2 pb-2">
        <h2>Fastype!</h2>
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
    <div v-if="!finished && !running">
      <div class="alert alert-info">
        Write the characters as fast as posible. (Not case-sensitive).
      </div>
    </div>
    <div v-if="running">
      <h4 class="text-center" v-html="randomWordColored"></h4>
      <div class="text-center">
        <input type="text"
               ref="inputChars"
               v-model="inputChars"
               id="inputChars"
               @input="checkInput"
               :maxlength="randomWord.length">
      </div>
    </div>
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
        running: false,
        finished: false,
        inputChars: "",
        randomWord: "",
        secondsLeft: 60,
        secondsTotal: 60,
        timer: null,
        correctCount: 0,
        lastKey: ''
      }
    },
    methods: {
      start: function() {
        this.finished = false;
        this.running = true;
        this.correctCount = 0;
        this.getNewWord();

        this.secondsLeft = this.secondsTotal;
        var vm = this;
        this.timer = setInterval(function() {
          vm.secondsLeft -= 1;
          console.log('tick '+vm.secondsLeft);
          if (vm.secondsLeft == 0) {
            console.log('stop');
            vm.stop();
          }
        },1000);

        // I don't know why it takes a while for the dom to update
        // so i can't focus the input right away, thus i'll wait 10 milliseconds
        // TODO: investigate on this, and find a better solution
        var vm = this;
        setTimeout(function() {
          vm.$refs.inputChars.focus();
        }, 10);
      },
      stop: function(){
        clearInterval(this.timer);
        this.timer = null;
        this.running = false;
        this.finished = true;
      },
      getNewWord: function() {
        this.inputChars = "";
        this.randomWord = this.generateRandomWord();
      },
      generateRandomWord: function() {
        let chars = 'QWERTYUIOPASDFGHJKLZXCVBNM';
        let word = '';
        for (var i = 0; i < this.correctCount+3; i++) {
          let n = Math.floor(Math.random(0,1) * chars.length);
          word += chars[n];
        }
        return word;
      },
      checkInput: function() {
        if (this.randomWord == this.inputChars.toUpperCase()) { // word completed
          this.correctCount++;
          this.getNewWord();
        }
      }
    },
    computed: {
      randomWordColored: function() {
        let coloredWord = '';
        for (var i = 0; i < this.randomWord.length; i++) {
          if (this.randomWord[i] == this.inputChars.toUpperCase()[i]) {
            coloredWord += '<span class="text-success">'+this.randomWord[i]+'</span>';
          }
          else if (i < this.inputChars.length) {
            coloredWord += '<span class="text-danger">'+this.randomWord[i]+'</span>';
          }
          else {
            coloredWord += this.randomWord[i];
          }
        }
        return coloredWord;
      }
    }
  }
</script>

<style>
</style>
