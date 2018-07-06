<template>
  <div id="app">
    <app-header></app-header>
    <app-content></app-content>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Content from './components/Content.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    appHeader: Header,
    appContent: Content,
    appFooter: Footer
  }
}
</script>

<style lang="scss">
  @import "./styles/settings.scss";
  body {
    background-color: #fff;
    color: $default-text-color;
  }

  a:hover {
    text-decoration: none;
  }
</style>
