<template>
  <div>
    <router-link  tag="button"
                  class="btn btn-primary"
                  to="/">
      <i class="fas fa-angle-left"></i>
      Go Back
    </router-link>
    <div id="appContainer">
      <component v-if="found" v-bind:is="compo"></component>
      <p v-if="!found">App not found.</p>
    </div>
  </div>
</template>
<script>
  import arithmeticus from './Arithmeticus/Arithmeticus.vue'
  import fastype from './Fastype/Fastype.vue'

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
      'app-fastype' : fastype
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
