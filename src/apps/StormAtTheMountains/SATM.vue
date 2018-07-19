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
      <div v-if="currentlyInBattle">
        <app-battle :yourParty="yourParty"
                    :enemies="enemies"
                    :activeCharacter="activeCharacter"
                    @battleAttack="battleAttack()"
                    @battleWait="battleWait()">
        </app-battle>
      </div>
      <div v-else>
        You defeated your foes.
      </div>
    </div>

    <div v-else-if="stage == 7">
      <i>You retrieve the old woman's bag.</i><br>
      <b>Young Boy:</b> Please don't kill me, I will never steal again, I promise,
      my mom is dying, she is ill, she needs medicine, I wanted to buy it for her,
      please forgive me.<br>
      The young boy is begging for mercy:
      <select v-model="decision2"><option :value="(index+1)" v-for="(decision, index) in options2">{{decision}}</option></select>
    </div>

    <div v-else-if="stage == 8">
      <i v-if="decision2 == 1">You give some money to the Young Boy.<br></i>
      <i v-else-if="decision2 == 2">You kick Young Boy's ass and let him go.<br></i>
      <i v-else-if="decision2 == 3">You kill the Young Boy.<br></i>
      <i>You give the bag back to the old woman.<br></i>
      <b>Old Woman:</b> May the goddess Leda bless your kind souls.
    </div>

    <div v-else-if="stage == 9">
      You reach the base of the mountains, there is a thunderstorm here.<br>
      The strong winds and the heavy rain make the journey harder.<br>
      The noise of the thunders startles you every time.<br>
      The cold breeze on your face makes your nose freeze.<br>
      The water of the rain is going down by path you are following.
    </div>

    <div v-else-if="stage == 10">
      <div v-if="currentlyInBattle">
        <app-battle :yourParty="yourParty"
                    :enemies="enemies"
                    :activeCharacter="activeCharacter"
                    @battleAttack="battleAttack()"
                    @battleWait="battleWait()">
        </app-battle>
      </div>
      <div v-else>
        You defeated your foes.
      </div>
    </div>

    <div v-else-if="stage == 11">
      As you are getting closer to the center of the mountains.<br>
      You notice that most lightnings are striking in the center of the mountains.
    </div>

    <div v-else-if="stage == 12">
      <div v-if="currentlyInBattle">
        <app-battle :yourParty="yourParty"
                    :enemies="enemies"
                    :activeCharacter="activeCharacter"
                    @battleAttack="battleAttack()"
                    @battleWait="battleWait()">
        </app-battle>
      </div>
      <div v-else>
        You defeated your foes.
      </div>
    </div>

    <div v-else-if="stage == 13">
      You reach the center of the mountains.<br>
      You see an enormous humanoid body made from stone, it is a Stone Golem.<br>
      It is standing there without moving.<br>
      It is getting struck by most of the storm lightnings.<br>
      It doesn't seem get affected by them.<br>
      Behind it you spot a man wearing a black robe, it is a Warlock.<br>
      He is constantly moving his hands in a recurring pattern.<br>
      He has a fixed gaze and doesn't seem to have noticed your presence.<br>
      He suddenly he stop moving his hands, he stares directly at you.<br>
      The stone golem starts to move towards you.
    </div>

    <div v-else-if="stage == 14">
      <div v-if="currentlyInBattle">
        <app-battle :yourParty="yourParty"
                    :enemies="enemies"
                    :activeCharacter="activeCharacter"
                    @battleAttack="battleAttack()"
                    @battleWait="battleWait()">
        </app-battle>
      </div>
      <div v-else>
        You defeated your foes.
      </div>
    </div>

    <div v-else-if="stage == 15">
      <b><i>The storm at the mountains has stopped.</i></b>
    </div>

    <hr>
    <button class="btn btn-primary" @click="stage = advanceStage(stage)">Ok</button>
  </div>
</template>

<script>
import encounters from './encounters.json';
import battle from './Battle.vue';

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
          return 8;
        break;

        case 8:
          return 9;
        break;

        case 9:
          this.currentlyInBattle = this.startBattle(2);
          return 10;
        break;

        case 10:
          if (!this.currentlyInBattle) return 11;
        break;

        case 11:
          this.currentlyInBattle = this.startBattle(3);
          return 12;
        break;

        case 12:
          if (!this.currentlyInBattle) return 13;
        break;

        case 13:
          this.currentlyInBattle = this.startBattle(4);
          return 14;
        break;

        case 14:
          if (!this.currentlyInBattle) return 15;
        break;

        case 15:
          return 1;
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

      if (this.aliveEnemies.length == 0) { // battle is over
        this.currentlyInBattle = false;
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
  },
  components: {
    'app-battle' : battle
  }
}

</script>
