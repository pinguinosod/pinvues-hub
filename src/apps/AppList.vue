<template>
  <div class="row">
    <div class=" col-12 col-md-6 col-lg-4"
      v-for="app in apps">
      <div class="appPreview">
        <h3>{{ app.name }}</h3>
        <p>{{ app.description }}</p>
        <p class="text-right">By {{ app.author }}</p>
        <p>
          <router-link :to="'/apps/'+ app.url"
                       tag="button"
                       class="btn btn-primary">
            <i class="fas fa-play"></i> Play {{ app.name }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "../styles/settings.scss";

  div.appPreview {
    border: 1px solid gray;
    margin-top: 10px;
    padding: 10px;
    background-color: $alternative-background-color;
    color: $alternative-text-color;
  }

  div.appPreview:last-child {
    margin-bottom: 10px;
  }
</style>

<script>
  import apps from './apps.json'

  export default {
    data () {
      return {
        apps: apps
      }
    }
  }
</script>
