<template>
  <div class="row">
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

    <div id="actionBar" class="col-12">
      It is {{ activeCharacter.name }}'s turn.<br>
      Action:
      <button class="btn btn-sm btn-primary" @click="$emit('battleAttack')">Attack</button>
      <button class="btn btn-sm btn-default" @click="$emit('battleWait')">Wait</button>
    </div>

    <div id="combatLog"></div>
  </div>
</template>

<script>
  export default {
    props:['yourParty','enemies','activeCharacter']
  }
</script>
