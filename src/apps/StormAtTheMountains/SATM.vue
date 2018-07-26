<i18n src='./i18n/locales.json'></i18n>

<template>
  <div>
    <h3>Storm at the Mountains</h3>
    <div v-if="stage == 0">
      {{ $t('Language') }}: <select class="form-control" v-model="locale">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
    </div>
    <div v-if="stage == 1">
      {{ $t('Your name') }}: <input type="text" class="form-control" v-model="playerCharacter.name"><br>
      {{ $t('Your gender') }}: <select class="form-control" v-model="playerCharacter.gender">
                    <option :value="gender" v-for="gender in genders">{{ $t(gender) }}</option>
                   </select>
    </div>

    <div v-else-if="stage == 2">
      {{ $t('Your class') }}: <select class="form-control" v-model="playerCharacter.class">
                   <option :value="aclass.name" v-for="aclass in classes">{{ $t(aclass.name) }}</option>
                  </select>
      <i>{{ $t(getClassByName(playerCharacter.class).description) }}</i>
    </div>

    <div v-else-if="stage == 3">
      {{ $t('stage3.rockFalling') }}<br>
      {{ $t('stage3.thunderstorm') }}<br>
      {{ $t('stage3.offersReward') }}<br>
      {{ $t('stage3.takeQuest') }}<br>
      {{ $t('stage3.friendsStartJourney', {'partnerName': partner.name}) }}
    </div>

    <div v-else-if="stage == 4">
      {{ $t('stage4.youngboyRunning') }}<br>
      <b>{{ $t('Old Woman') }}:</b> {{ $t('stage4.stopStoleBag') }}<br>
      {{ $t('What are you going to do?') }}:
      <select class="form-control" v-model="decision1">
        <option :value="(index+1)" v-for="(decision, index) in options1">{{ $t(decision) }}</option>
      </select>
    </div>

    <div v-else-if="stage == 5">
      {{ $t('stage5.chaseYBCave') }}<br>
      {{ $t('stage5.YBCornered') }}<br>
      {{ $t('stage5.fightBack') }}
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
      <i>{{ $t('stage7.retrieveBag') }}</i><br>
      <b>{{ $t('Young Boy') }}:</b> {{ $t('stage7.pleaseDontKillMe') }}<br>
      {{ $t('stage7.YBBegging') }}:
      <select class="form-control" v-model="decision2">
        <option :value="(index+1)" v-for="(decision, index) in options2">{{ $t(decision) }}</option>
      </select>
    </div>

    <div v-else-if="stage == 8">
      <i v-if="decision2 == 1">{{ $t('stage8.giveMoneyToYB') }}<br></i>
      <i v-else-if="decision2 == 2">{{ $t('stage8.letYBGo') }}<br></i>
      <i v-else-if="decision2 == 3">{{ $t('stage8.killYB') }}<br></i>
      <i>{{ $t('stage8.giveBagBack') }}<br></i>
      <b>{{ $t('Old Woman') }}:</b> {{ $t('stage8.mayLedaBless') }}
    </div>

    <div v-else-if="stage == 9">
      {{ $t('stage9.reachBaseMountains') }}<br>
      {{ $t('stage9.strongWindsHeavyRain') }}<br>
      {{ $t('stage9.noiseOfThunders') }}<br>
      {{ $t('stage9.coldBreeze') }}<br>
      {{ $t('stage9.waterRain') }}
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

    <div v-else-if="stage == 11" v-html="$t('stage11.gettingCloser')">
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

    <div v-else-if="stage == 13" v-html="$t('stage13.combatStarts')">
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
      <b><i>{{ $t('stage15.SATMStopped') }}</i></b>
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
      stage: 0,
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
      expMap: expMap,
      locale: 'en'
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
        case 0:
          return 1;
        break;

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
  watch: {
    locale (val) {
      this.$i18n.locale = val
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
