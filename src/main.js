import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {auth, analytics} from './firebaseConfig.js'

Vue.config.productionTip = false

// Vue Material
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
Vue.use(VueMaterial)

import './assets/scss/app.scss'

// markdown parser
import VueSimpleMarkdown from '../src/assets/js/vue-simple-markdown.js'
Vue.use(VueSimpleMarkdown)

// service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
}

// console disclaimers
console.log('%cAtttention !', 'color: #f00; background: #ff0; font-size: 24px')
console.log('%cEn utilisant cette console, vous vous exposez au risque que des personnes malveillantes usurpent votre identité et volent vos informations par le biais d\'une attaque appelée Self-XSS.\nNe saisissez pas et ne copiez pas du code que vous ne comprenez pas.', 'font-size: 16px')
console.log('%cLe code du site est open source → https://github.com/Aryqs-Ipsum/farman-info', 'color: #333; font-size: 16px')

let app

document.getElementById('splash-message').innerText = "Authentification ..."

auth.onAuthStateChanged(user => {
    if(user) analytics.setUserId(user.uid)
    
    if(!app) {
        app = new Vue({
            data: {
                loading: {
                    state: false,
                    mode: 'indeterminate'
                },
                toast: {
                    open: false,
                    value: ''
                },
                alert: {
                    open: false,
                    value: ''
                },
                user: user
            },
            el: '#app',
            router,
            render: h => h(App)
        })

        router.beforeEach((to, from, next) => {
            app.loading.state = true
            app.loading.mode = 'indeterminate'
            next()
        })
            
        router.afterEach(() => {
            app.loading.state = false
        })

        app.$root.$on('query:loading', () => {
            app.loading.state = true
            app.loading.mode = 'query'
        })

        app.$root.$on('query:loaded', () => {
            app.loading.state = false
        })

        app.$root.$on('toast', value => {
            app.toast.open = true
            app.toast.value = value
        })

        app.$root.$on('alert', value => {
            app.alert.open = true
            app.alert.value = value
        })
    }
})