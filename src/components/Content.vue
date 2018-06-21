<template>
  <main>
    <div class="container">
      <router-view></router-view>
    </div>
  </main>
</template>

<script>
  import About from './About.vue';

  export default {
    components: {
      appAbout: About
    }
  }
</script>

<style lang="scss">
  @import "../styles/settings.scss";

  main {
    min-height: $content-height;
    background-color: $default-background-color;
  }
</style>
