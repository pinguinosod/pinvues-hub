<template>
  <div class="row">
    <div class="col-6">
      <div id="yourParty">
        <div class="characterCard mb-5" v-for="friendlyCharacter in yourParty">
          <h4>{{ friendlyCharacter.name }}</h4>
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
        <div :class="{ deadChar: enemyCharacter.hp <=0 }" class="characterCard mb-5" v-for="enemyCharacter in enemies">
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
    <div id="actionBar" class="col-12">
      It is <b>{{ activeCharacter.name }}</b>'s turn.<br>
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
</style>
