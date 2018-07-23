<template>
  <div>
    <h3>Storm at the Mountains</h3>
    <div v-if="stage == 1">
      Your name: <input type="text" class="form-control" v-model="playerCharacter.name"><br>
      Your gender: <select class="form-control" v-model="playerCharacter.gender">
                    <option :value="gender" v-for="gender in genders">{{gender}}</option>
                   </select>
    </div>

    <div v-else-if="stage == 2">
      Your class: <select class="form-control" v-model="playerCharacter.class">
                   <option :value="aclass.name" v-for="aclass in classes">{{aclass.name}}</option>
                  </select>
      <i>{{ getClassByName(playerCharacter.class).description }}</i>
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
      <select class="form-control" v-model="decision1">
        <option :value="(index+1)" v-for="(decision, index) in options1">{{decision}}</option>
      </select>
    </div>

    <div v-else-if="stage == 5">
      You chase the young boy until he enters a cave beneath the ruins of an old castle.<br>
      The cave has no way out, the young boy is cornered.<br>
      He refuses to give the bag back, he wants to fight.
    </div>

    <div v-else-if="stage == 6">
      <app-battle :currentlyInBattle="currentlyInBattle"
                  :yourParty="yourParty"
                  :enemies="enemies"
                  :activeCharacter="activeCharacter"
                  :combatLog="combatLog"
                  @battleAttack="battleAttack()"
                  @battleWait="battleWait()">
      </app-battle>
    </div>

    <div v-else-if="stage == 7">
      <i>You retrieve the old woman's bag.</i><br>
      <b>Young Boy:</b> Please don't kill me, I will never steal again, I promise,
      my mom is dying, she is ill, she needs medicine, I wanted to buy it for her,
      please forgive me.<br>
      The young boy is begging for mercy:
      <select class="form-control" v-model="decision2">
        <option :value="(index+1)" v-for="(decision, index) in options2">{{decision}}</option>
      </select>
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
      <app-battle :currentlyInBattle="currentlyInBattle"
                  :yourParty="yourParty"
                  :enemies="enemies"
                  :activeCharacter="activeCharacter"
                  :combatLog="combatLog"
                  @battleAttack="battleAttack()"
                  @battleWait="battleWait()">
      </app-battle>
    </div>

    <div v-else-if="stage == 11">
      As you are getting closer to the center of the mountains.<br>
      You notice that most lightnings are striking in the center of the mountains.
    </div>

    <div v-else-if="stage == 12">
      <app-battle :currentlyInBattle="currentlyInBattle"
                  :yourParty="yourParty"
                  :enemies="enemies"
                  :activeCharacter="activeCharacter"
                  :combatLog="combatLog"
                  @battleAttack="battleAttack()"
                  @battleWait="battleWait()">
      </app-battle>
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
      <app-battle :currentlyInBattle="currentlyInBattle"
                  :yourParty="yourParty"
                  :enemies="enemies"
                  :activeCharacter="activeCharacter"
                  :combatLog="combatLog"
                  @battleAttack="battleAttack()"
                  @battleWait="battleWait()">
      </app-battle>
    </div>

    <div v-else-if="stage == 15">
      <b><i>The storm at the mountains has stopped.</i></b>
    </div>

    <template v-if="!currentlyInBattle">
      <hr>
      <button class="btn btn-primary" @click="stage = advanceStage(stage)">Ok</button>
    </template>
  </div>
</template>

<script>
import encounters from './encounters.json';
import expMap from './expMap.json';
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
        hpMax: 100,
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
        hpMax: 100,
        mp: 50,
        minAttack: 30,
        maxAttack: 50
      },
      stage: 1,
      classes: [
                {name:'Fighter', description:'Likes to punch things, pretty tanky.'},
                {name:'Mage', description:'Likes to cast spells, pretty squishy.'}
               ],
      genders: ['Male', 'Female', 'Other'],
      names: [
        ['Markus', 'Stefan', 'Hartwig', 'Maximilian', 'Scott', 'Vincent', 'Herman', 'Robert', 'Fernand'],
        ['Sabine', 'Johanna', 'Jacqueline', 'Christina', 'Claire', 'Natalie', 'Olga', 'Karin', 'Lena']
      ],
      options1: ['Chase him (Tutorial)', 'Let him go (Skip tutorial)'],
      decision1: 1,
      options2: ['Give him some money', 'Let him go', 'Kill him'],
      decision2: 1,
      currentlyInBattle: false,
      enemies: [],
      activeCharacterIndex: 0,
      encounters: encounters,
      turnList: [],
      combatLog: [],
      expMap: expMap
    }
  },
  methods: {
    generatePartner: function() {
      const rndClass = Math.floor(Math.random() * this.classes.length);
      this.partner.class = this.classes[rndClass].name;

      const rndGender = Math.floor(Math.random() * this.genders.length);
      this.partner.gender = this.genders[rndGender];

      const rndNameGender = rndGender > 1 ? Math.floor(Math.random() * 2) : rndGender;
      const rndName = Math.floor(Math.random() * this.names[rndNameGender].length);
      this.partner.name = this.names[rndNameGender][rndName];
    },
    getClassByName: function(name) {
      var classFound = false;
      this.classes.forEach(function(aclass) {
        if (aclass.name == name) {
          classFound = aclass;
          return true;
        }
      });
      return classFound;
    },
    advanceStage: function(currentStage) {
      if (this.playerCharacter.hp == 0
          && this.partner.hp == 0) {
        // you lost, start again.
        this.restartGame();
        return 1;
      }

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

        case 6: // Tutorial Battle
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

        case 10: // 2nd Battle
          if (!this.currentlyInBattle) {
            // level requirement to go on
            if (this.playerCharacter.level + this.partner.level >= 3) {
              return 11;
            }
            else { // keep fighting
              this.currentlyInBattle = this.startBattle(2);
            }
          }
        break;

        case 11:
          this.currentlyInBattle = this.startBattle(3);
          return 12;
        break;

        case 12: // 3rd Battle
          if (!this.currentlyInBattle) {
            // level requirement to go on
            if (this.playerCharacter.level + this.partner.level >= 4) {
              return 13;
            }
            else { // keep fighting
              this.currentlyInBattle = this.startBattle(3);
            }
          }
        break;

        case 13:
          this.currentlyInBattle = this.startBattle(4);
          return 14;
        break;

        case 14: // Final Battle
          if (!this.currentlyInBattle) return 15;
        break;

        case 15:
          this.restartGame();
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

      if (battleStarted) {
        this.rollInitiative(); // shuffle turn list
        this.combatLog = []; // clear combat log
        this.endTurn(); // first one passes and triggers enemy attack if an enemy is 2nd
      }

      return battleStarted;
    },
    battleAttack: function() {
      const rndEnemy = Math.floor(Math.random() * this.aliveEnemies.length);
      this.attack(this.activeCharacter, this.aliveEnemies[rndEnemy]);
    },
    battleWait: function() {
      this.heal(this.activeCharacter);
      this.endTurn();
    },
    enemyAttack: function(enemy) {
      const rndTarget = Math.floor(Math.random() * 2)+1;
      if (rndTarget == 1) {
        this.attack(enemy, this.playerCharacter);
      }
      else {
        this.attack(enemy, this.partner);
      }
    },
    attack: function(attacker, defender) {
      const dmg = attacker.minAttack + Math.floor(Math.random() * (attacker.maxAttack-attacker.minAttack));
      defender.hp -= dmg;
      this.logCombat(`<strong>${attacker.name}</strong> attacks <strong>${defender.name}</strong>, dealing <strong class="text-danger">${dmg}</strong> points of damage.`);
      if (defender.hp <= 0) {
        defender.hp = 0;
        this.logCombat(`<span class="text-danger"><strong>${defender.name}</strong> dies.</span>`);
        if(defender.expYield > 0) {
          this.grantExperienceTo(attacker, defender.expYield);
        }
        if(this.playerCharacter.hp == 0 && this.partner.hp == 0) {
          // you lost
          this.logCombat(`<i>You lost.</i>`);
        }
      }
      this.endTurn();
    },
    heal: function(character) {
      let healing = 1 + Math.floor(Math.random() * (character.hpMax/10));
      if (healing + character.hp > character.hpMax) {
        healing = character.hpMax - character.hp;
      }
      character.hp += healing;
      this.logCombat(`<strong>${character.name}</strong> rests and heals <strong class="text-success">${healing}</strong> health points.`);
    },
    grantExperienceTo: function(character, exp) {
      /*
      if (character.name == this.playerCharacter.name) {
        this.playerCharacter.exp += exp;
      }
      else {
        this.partner.exp += exp;
      }
      */
      character.exp += exp;
      if (character.exp >= this.expMap[character.level+1]) {
        //level up
        this.levelUp(character);
      }
    },
    levelUp: function(character) {
      character.level += 1;
      character.hp = character.hpMax;
      this.logCombat(`<span class="text-info"><strong>${character.name}</strong> advances to level <strong>${character.level}</strong>.</span>`);
    },
    logCombat: function(entry) {
      this.combatLog.push(entry);
    },
    endTurn: function() {
      if (this.activeCharacterIndex == this.turnList.length-1) {
        this.activeCharacterIndex = 0;
      }
      else {
        this.activeCharacterIndex += 1;
      }

      if (this.aliveEnemies.length == 0) { // battle is over, you won
        this.currentlyInBattle = false;
        // your party rest a little after a fight,
        // this also revives the dead
        this.heal(this.playerCharacter);
        this.heal(this.partner);
        return true;
      }
      if (this.playerCharacter.hp == 0 && this.partner.hp == 0) { // you lost
        this.currentlyInBattle = false;
        return true;
      }

      let charActive = this.getCharacterByName(this.turnList[this.activeCharacterIndex]);
      if (charActive.hp == 0) { // character is dead, pass
        this.endTurn();
      }
      else if (charActive.name != this.playerCharacter.name
          && charActive.name != this.partner.name) { // Its an enemy
        this.enemyAttack(charActive);
      }
    },
    shuffle: function(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    rollInitiative: function() {
      this.activeCharacterIndex = 0; // reset turns
      let turnList = [];
      this.yourParty.map(function(val) {
        turnList.push(val.name);
      });
      this.enemies.map(function(val) {
        turnList.push(val.name);
      });
      this.turnList = this.shuffle(turnList);
    },
    getCharacterByName: function(name) {
      // This shouldn't exist, I should use an ID instead
      var charFound = false;
      this.yourParty.concat(this.enemies).forEach(function(achar) {
        if (achar.name == name) {
          charFound = achar;
          return true;
        }
      });
      return charFound;
    },
    restartGame: function() {
      this.playerCharacter.name = '';

      //hp
      this.playerCharacter.hp = this.playerCharacter.hpMax;
      this.partner.hp = this.partner.hpMax;

      //exp and level
      this.playerCharacter.exp = 0;
      this.partner.exp = 0;
      this.playerCharacter.level = 1;
      this.partner.level = 1;
    }
  },
  computed: {
    yourParty: function() {
      return [this.playerCharacter, this.partner];
    },
    activeCharacter: function() {
      return this.getCharacterByName(this.turnList[this.activeCharacterIndex]);
    },
    aliveEnemies: function() {
      return this.enemies.filter(function(enemy) {
        return enemy.hp > 0;
      });
    }
  },
  mounted: function() {
    this.playerCharacter.gender = this.genders[0];
    this.playerCharacter.class = this.classes[0].name;
  },
  components: {
    'app-battle' : battle
  }
}

</script>
