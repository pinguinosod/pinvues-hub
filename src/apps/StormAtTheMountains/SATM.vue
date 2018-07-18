<template>
  <div>
    <h3>Storm at the Mountains</h3>
    <div v-if="stage == 1">
      Your name: <input type="text" v-model="playerCharacter.name">
      Your gender: <select v-model="playerCharacter.gender"><option :value="gender" v-for="gender in genders">{{gender}}</option></select>
    </div>

    <div v-else-if="stage == 2">
      Your class: <select v-model="playerCharacter.class"><option :value="aclass" v-for="aclass in classes">{{aclass}}</option></select>
    </div>

    <div v-else-if="stage == 3">
      You see an enormous rock falling from the sky and landing on the mountains area,
      the impact makes the ground temble.<br>
      A heavy thunderstorm starts there.<br>
      Lord Steiner offers a reward for those who go, investigate, and come back with a report.<br>
      Since you are an adventurer, you decided to take the quest.<br>
      Your friend {{ partner.name }} knows a way to the center of the mountains,
      you both gear up and start your journey immediately.
    </div>

    <div v-else-if="stage == 4">
      While you are heading to the mountains, you see a young boy running with a bag on his hand,
      behind him is an old woman trying to catch him, but she is too slow.<br>
      <b>Old Woman:</b> Please stop him, he stole my bag!!<br>
      What are you going to do?:
      <select v-model="decision1"><option :value="(index+1)" v-for="(decision, index) in options1">{{decision}}</option></select>
    </div>

    <div v-else-if="stage == 5">
      You chase the young boy until he enters a cave beneath the ruins of an old castle.<br>
      The cave has no way out, the young boy is cornered.<br>
      He refuses to give the bag back, he wants to fight.
    </div>

    <div v-else-if="stage == 6">
      <div v-if="currentlyInBattle" class="row">
        <div id="yourParty" class="col-6">
          <div class="characterCard" v-for="friendlyCharacter in yourParty">
            <h4>{{ friendlyCharacter.name }}</h4>
            <span class="hp">{{ friendlyCharacter.hp }}</span>
          </div>
        </div>

        <div id="enemyParty" class="col-6">
          <div :class="{ deadChar: enemyCharacter.hp <=0 }" class="characterCard" v-for="enemyCharacter in enemies">
            <h4>{{ enemyCharacter.name }}</h4>
            <span class="hp">{{ enemyCharacter.hp > 0 ? enemyCharacter.hp : 0 }}</span>
          </div>
        </div>

        <div id="actionBar">
          It is {{ activeCharacter.name }}'s turn.
          Action:
          <button class="btn btn-sm btn-primary" @click="battleAttack()">Attack</button>
          <button class="btn btn-sm btn-default" @click="battleWait()">Wait</button>
        </div>

        <div id="combatLog"></div>
      </div>
      <div v-else>
        You defeated your foes.
      </div>
    </div>

    <div v-else-if="stage == 7">
    </div>

    <div v-else-if="stage == 8">
    </div>

    <div v-else-if="stage == 9">
    </div>

    <div v-else-if="stage == 10">
    </div>

    <div v-else-if="stage == 11">
    </div>

    <div v-else-if="stage == 12">
    </div>

    <div v-else-if="stage == 13">
    </div>

    <div v-else-if="stage == 14">
    </div>

    <div v-else-if="stage == 15">
    </div>

    <hr>
    <button class="btn btn-primary" @click="stage = advanceStage(stage)">Ok</button>
  </div>
</template>

<script>
import encounters from './encounters.json'

export default {
  data: function() {
    return {
      test: 'hello world',
      playerCharacter: {
        name: '',
        class: '',
        gender: '',
        exp: 0,
        level: 1,
        hp: 100,
        mp: 50,
        minAttack: 30,
        maxAttack: 50
      },
      partner: {
        name: '',
        class: '',
        gender: '',
        exp: 0,
        level: 1,
        hp: 100,
        mp: 50,
        minAttack: 30,
        maxAttack: 50
      },
      stage: 1,
      classes: ['Fighter', 'Mage'],
      genders: ['Male', 'Female', 'Other'],
      names: [
        ['Markus', 'Stefan', 'Hartwig', 'Maximilian'],
        ['Sabine', 'Johanna', 'Jacqueline', 'Christina']
      ],
      options1: ['Chase him (Tutorial)', 'Let him go (Skip tutorial)'],
      decision1: 1,
      options2: ['Give him some money', 'Let him go', 'Kill him'],
      decision2: 1,
      currentlyInBattle: false,
      enemies: [],
      activeCharacterIndex: 0,
      encounters: encounters
    }
  },
  methods: {
    generatePartner: function() {
      const rndClass = Math.floor(Math.random() * this.classes.length);
      this.partner.class = this.classes[rndClass];

      const rndGender = Math.floor(Math.random() * this.genders.length);
      this.partner.gender = this.genders[rndGender];

      const rndNameGender = rndGender > 1 ? Math.floor(Math.random() * 2) : rndGender;
      const rndName = Math.floor(Math.random() * this.names[rndNameGender].length);
      this.partner.name = this.names[rndNameGender][rndName];
    },
    advanceStage: function(currentStage) {
      switch(currentStage) {
        case 1:
          if (this.playerCharacter.name != ''
              && this.playerCharacter.gender != '') return 2;
        break;

        case 2:
          if (this.playerCharacter.class != '') {
            this.generatePartner();
            return 3;
          }
        break;

        case 3:
          return 4;
        break;

        case 4:
          if (this.decision1 == 1) return 5; // tutorial
          else if (this.decision1 == 2) return 9; // skip tutorial
        break;

        case 5:
          this.currentlyInBattle = this.startBattle(1);
          return 6;
        break;

        case 6:
          if (!this.currentlyInBattle) return 7;
        break;

        case 7:
        break;

        case 8:
        break;

        case 9:
        break;

        case 10:
        break;

        case 11:
        break;

        case 12:
        break;

        case 13:
        break;

        case 14:
        break;

        case 15:
        break;
      }
      return currentStage; // a validation failed, stay on the current stage
    },
    startBattle: function(battleN) {
      let battleStarted = false;

      // I am using JSON.stringify and JSON.parse,
      // because I want to make a copy of the enemies,
      // and not reference them from the encounters.

      switch(battleN) {
        case 1: // Young Boy (Tutorial)
          this.enemies = JSON.parse(JSON.stringify(this.encounters[0][0]));
          battleStarted = true;
        break;

        case 2: // Random (Mountain Path)
          const mountainPath01Encounters = this.encounters[1];

          const rndEnemy = Math.floor(Math.random() * mountainPath01Encounters.length);
          this.enemies = JSON.parse(JSON.stringify(mountainPath01Encounters[rndEnemy]));
          battleStarted = true;
        break;

        case 3: // Random (Mountain Path 2)
          const mountainPath02Encounters = this.encounters[2];

          const rndEnemy2 = Math.floor(Math.random() * mountainPath02Encounters.length);
          this.enemies = JSON.parse(JSON.stringify(mountainPath02Encounters[rndEnemy2]));
          battleStarted = true;
        break;

        case 4: // Stone Golem and Warlock
          this.enemies = JSON.parse(JSON.stringify(this.encounters[3][0]));
          battleStarted = true;
        break;
      }

      return battleStarted;
    },
    battleAttack: function() {
      const rndEnemy = Math.floor(Math.random() * this.aliveEnemies.length);
      this.attack(this.activeCharacter, this.aliveEnemies[rndEnemy]);
    },
    battleWait: function() {
      this.endTurn();
    },
    attack: function(attacker, defender) {
      const dmg = attacker.maxAttack - attacker.minAttack;
      defender.hp -= dmg;
      this.endTurn();
    },
    endTurn: function() {
      if (this.activeCharacterIndex == this.yourParty.length-1) {
        this.activeCharacterIndex = 0;
      }
      else {
        this.activeCharacterIndex += 1;
      }
    }
  },
  computed: {
    yourParty: function() {
      return [this.playerCharacter, this.partner];
    },
    activeCharacter: function() {
      return this.yourParty[this.activeCharacterIndex];
    },
    aliveEnemies: function() {
      return this.enemies.filter(function(enemy) {
        return enemy.hp > 0;
      });
    }
  },
  mounted: function() {
    this.playerCharacter.gender = this.genders[0];
    this.playerCharacter.class = this.classes[0];
  }
}

</script>
