import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App.vue'
import VueI18n from 'vue-i18n'
import { routes } from './routes'


Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueI18n)

const router = new VueRouter({
  routes
})

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: {
    }
  }
})

new Vue({
  i18n,
  el: '#app',
  router,
  render: h => h(App)
})
