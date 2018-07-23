<template>
  <div class="row">
    <div class="col-6">
      <div id="yourParty">
        <div class="characterCard mb-2" v-for="friendlyCharacter in yourParty">
          <h4>{{ friendlyCharacter.name }}
            <small>
              Lvl.{{ friendlyCharacter.level }}
              ({{ getLevelUpProgress(friendlyCharacter.level, friendlyCharacter.exp) }}%)
            </small>
          </h4>
          <div class="progress">
            <div class="progress-bar progress-bar-striped bg-success" role="progressbar"
                 :class="{
                          'bg-success': ((friendlyCharacter.hp/friendlyCharacter.hpMax)*100) >= 20,
                          'bg-danger': ((friendlyCharacter.hp/friendlyCharacter.hpMax)*100) < 20
                         }"
                 :style="{'width': ((friendlyCharacter.hp/friendlyCharacter.hpMax)*100) +'%'}">
                 {{ friendlyCharacter.hp }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-6">
      <div id="enemyParty">
        <div :class="{ deadChar: enemyCharacter.hp <=0 }" class="characterCard mb-2" v-for="enemyCharacter in enemies">
          <h4>{{ enemyCharacter.name }}</h4>
          <div class="progress">
            <div class="progress-bar progress-bar-striped" role="progressbar"
                 :class="{
                          'bg-success': ((enemyCharacter.hp/enemyCharacter.hpMax)*100) >= 20,
                          'bg-danger': ((enemyCharacter.hp/enemyCharacter.hpMax)*100) < 20
                         }"
                 :style="{'width': ((enemyCharacter.hp/enemyCharacter.hpMax)*100) +'%'}">
                 {{ enemyCharacter.hp }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12"><hr></div>
    <div id="combatLog" class="col-12">
      <ul>
        <transition-group name="swipe-right">
        <li v-html="entry" v-for="(entry, index) in reversedCombatLog" :key="(reversedCombatLog.length-index)"></li>
        </transition-group>
      </ul>
    </div>
    <div v-if="currentlyInBattle" id="actionBar" class="col-12">
      It is <b>{{ activeCharacter.name }}</b>'s turn.<br>
      Action:
      <button class="btn btn-sm btn-primary" @click="$emit('battleAttack')">Attack</button>
      <button class="btn btn-sm btn-default" @click="$emit('battleWait')">Wait</button>
    </div>
  </div>
</template>

<script>
  import expMap from './expMap.json';

  export default {
    props:['currentlyInBattle', 'yourParty', 'enemies', 'activeCharacter', 'combatLog'],
    data: function() {
      return {
        expMap: expMap
      }
    },
    methods: {
      getLevelUpProgress: function(level, exp) {
        let baseExp = this.expMap[level];
        let nextExp = this.expMap[level+1];
        let levelUpExpNeeded = nextExp - baseExp;
        let levelUpCurrentExp = exp - baseExp;
        return (levelUpCurrentExp / levelUpExpNeeded)*100;
      },
      getNextLevelExp: function(level) {
        return this.expMap[level+1];
      }
    },
    computed: {
      reversedCombatLog: function() {
        return this.combatLog.slice().reverse();
      }
    }
  }
</script>

<style scoped>
  #yourParty > div {
    padding:6px;
    border-radius:5px;
    background-color: #ddf;
  }

  #enemyParty > div {
    padding:6px;
    border-radius:5px;
    background-color: #fdd;
  }

  #combatLog > ul {
    background-color: #feb;
    height: 120px;
    overflow-y: auto;
    padding: 0px 7px 0px 7px;
    border-radius:6px;
  }

  #combatLog > ul > li {
    list-style: none;
  }
</style>
