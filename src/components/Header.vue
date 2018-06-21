<template>
  <header>
    <div class="container d-flex align-items-center">
      <div class="row">
        <div class="col-12" id="header"><h2 class="text-left">PinVue's Hub</h2></div>
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
    color: $quaternary-color;
  }
</style>
