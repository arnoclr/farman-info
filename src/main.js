import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store.js'
const fb = require('./firebaseConfig.js')
import './assets/scss/app.scss'

Vue.config.productionTip = false

// console disclaimers
console.log('%cAtttention !', 'color: #f00; background: #ff0; font-size: 24px')
console.log('%cEn utilisant cette console, vous vous exposez au risque que des personnes malveillantes usurpent votre identité et volent vos informations par le biais d\'une attaque appelée Self-XSS.\nNe saisissez pas et ne copiez pas du code que vous ne comprenez pas.', 'font-size: 16px')
console.log('%cLe code du site est open source → https://github.com/Aryqs-Ipsum/farman-info', 'color: #333; font-size: 16px')

let app
fb.auth.onAuthStateChanged(user => {
  store.commit('updateUser',{ user })
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    })
  }
})