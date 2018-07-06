<template>
  <header>
    <div class="container d-flex justify-content-between align-items-center">
        <div id="header">
          <router-link to="/">
            <h2 class="text-left">PinVue's Hub</h2>
          </router-link>
        </div>
        <div>
          <router-link to="/about">About</router-link>
        </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
  @import "../styles/settings.scss";
  header {
    height: $header-height;
    background-color: $primary-color;
  }
  .container {
    height:100%;
  }
  h2 {
    font-weight: bold;
  }
  h2:hover {

  }
  a {
    font-weight: bold;
    color: $secondary-color;
  }
  a:hover {
    font-weight: bold;
    color: $tertiary-color;
  }
</style>
