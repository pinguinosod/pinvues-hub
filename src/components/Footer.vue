<template>
  <footer>
    <div class="container d-flex justify-content-between align-items-center">
        <div>Made by PinguinoSod (David Cautin).</div>
        <div>
          <a href="https://github.com/pinguinosod/pinvues-hub"><i class="fab fa-github fa-2x"></i></a>
        </div>
    </div>
  </footer>
</template>

<style lang="scss">
  @import "../styles/settings.scss";
  footer {
    height: $footer-height;
    background-color: #000;
    color: #777;
  }
  .container {
    height:100%;
  }
  a {
    color: #777;
  }
  a:hover {
    color: #bbb;
  }
</style>
