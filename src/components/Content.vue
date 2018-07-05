<template>
  <main>
    <div class="container">
      <transition :name="swipeDirection" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </main>
</template>

<script>
  import About from './About.vue';

  export default {
    components: {
      appAbout: About
    },
    computed: {
      swipeDirection: function() {
        if (this.$route.path == "/") {
          return 'swipe-left';
        }
        else {
          return 'swipe-right';
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "../styles/settings.scss";
  @import "../styles/animations.scss";

  main {
    min-height: $content-height;
    background-color: $default-background-color;
  }
</style>
