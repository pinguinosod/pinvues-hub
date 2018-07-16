<template>
  <div>
    <router-link  tag="button"
                  class="btn btn-primary"
                  to="/">
      <i class="fas fa-angle-left"></i>
      Go Back
    </router-link>
    <div id="appContainer" class="mb-4">
      <component v-if="found" v-bind:is="compo"></component>
      <p v-if="!found">App not found.</p>
    </div>
  </div>
</template>
<script>
  import arithmeticus from './Arithmeticus/Arithmeticus.vue'
  import fastype from './Fastype/Fastype.vue'
  import sudoku from './Sudoku/Sudoku.vue'
  import cryptocurrency from './Cryptocurrency/Cryptocurrency.vue'
  import satm from './StormAtTheMountains/SATM.vue'

  export default {
    data () {
      return {
        compo: 'app-'+this.$route.params.app
      }
    },
    computed: {
      found: function (){
        return 'app-'+this.$route.params.app in this.$options.components;
      }
    },
    components: {
      'app-arithmeticus' : arithmeticus,
      'app-fastype' : fastype,
      'app-sudoku' : sudoku,
      'app-cryptocurrency' : cryptocurrency,
      'app-satm' : satm
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/settings.scss";

  button {
    margin-top:10px;
  }

  #appContainer{
    border: 1px solid gray;
    margin-top: 10px;
    padding: 10px;
    background-color: $alternative-background-color;
    color: $alternative-text-color;
  }
</style>
