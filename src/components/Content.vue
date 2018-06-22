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

  main {
    min-height: $content-height;
    background-color: $default-background-color;
  }

  .swipe-right-enter {
    transform: translateX(-20px);
    opacity: 0;
  }
  .swipe-left-enter {
    transform: translateX(20px);
    opacity: 0;
  }
  .swipe-right-enter-active,
  .swipe-right-leave-active,
  .swipe-left-enter-active,
  .swipe-left-leave-active  {
    transition: all ease-in .15s;
  }
  .swipe-right-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
  .swipe-left-leave-to {
    transform: translateX(-20px);
    opacity: 0;
  }
</style>
