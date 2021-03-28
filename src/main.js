import Vue from 'vue'
import App from './App.vue'
import router from './router'
const fb = require('./firebaseConfig.js')

Vue.config.productionTip = false

// Vue Material
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
Vue.use(VueMaterial)

import './assets/scss/app.scss'

// markdown parser
import VueSimpleMarkdown from '../src/assets/js/vue-simple-markdown.js'
// import 'vue-simple-markdown/dist/vue-simple-markdown.css'

Vue.use(VueSimpleMarkdown)

// console disclaimers
console.log('%cAtttention !', 'color: #f00; background: #ff0; font-size: 24px')
console.log('%cEn utilisant cette console, vous vous exposez au risque que des personnes malveillantes usurpent votre identité et volent vos informations par le biais d\'une attaque appelée Self-XSS.\nNe saisissez pas et ne copiez pas du code que vous ne comprenez pas.', 'font-size: 16px')
console.log('%cLe code du site est open source → https://github.com/Aryqs-Ipsum/farman-info', 'color: #333; font-size: 16px')

const app = new Vue({
  data: {
    loading: false,
    user: null
  },
  el: '#app',
  router,
  render: h => h(App)
})

fb.auth.onAuthStateChanged(user => {
  app.user = user
  app.$root.$emit('onAuthStateChanged')
})

router.beforeEach((to, from, next) => {
  app.loading = true
  next()
})

router.afterEach(() => {
  app.loading = false
})