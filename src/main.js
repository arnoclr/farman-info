import Vue from 'vue'
import VueMeta from 'vue-meta'
import App from './App.vue'
import router from './router'
import {auth, analytics} from './firebaseConfig.js'

Vue.config.productionTip = false
Vue.use(VueMeta)

// device & browser detection
import device from "vue-device-detector"
import browserDetect from "vue-browser-detect-plugin"
Vue.use(device)
Vue.use(browserDetect)

// viewport detection
import VueObserveVisibility from 'vue-observe-visibility'
Vue.use(VueObserveVisibility)

// mobile gestures
import Vue2TouchEvents from 'vue2-touch-events'
Vue.use(Vue2TouchEvents)

// load scripts
import LoadScript from 'vue-plugin-load-script'
Vue.use(LoadScript)

if(window.location.hostname === 'farman.ga') {
    window.location.href = 'https://farman.info?utm_source=farman.ga&utm_medium=direct'
}

// Vue Material
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
Vue.use(VueMaterial)

import './assets/scss/app.scss'

// markdown parser
import VueSimpleMarkdown from '../src/assets/js/vue-simple-markdown.js'
Vue.use(VueSimpleMarkdown)

// service worker
import './assets/js/registerServiceWorker'

window.showInstallPromotion = false
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    // Stash the event so it can be triggered later.
    window.deferredPrompt = e
    // Update UI notify the user they can install the PWA
    window.showInstallPromotion = true
})

// ads
import AutoAdsense from './autoAdsense'
AutoAdsense()

// console disclaimers
console.log('%cAtttention !', 'color: #f00; background: #ff0; font-size: 24px')
console.log('%cEn utilisant cette console, vous vous exposez au risque que des personnes malveillantes usurpent votre identité et volent vos informations par le biais d\'une attaque appelée Self-XSS.\nNe saisissez pas et ne copiez pas du code que vous ne comprenez pas.', 'font-size: 16px')
console.log('%cLe code du site est open source → https://github.com/Aryqs-Ipsum/farman-info', 'color: #333; font-size: 16px')

let app

document.getElementById('progress').value = 1

auth.onAuthStateChanged(user => {
    document.getElementById('progress').value = 2
    document.getElementById('load').classList.add('out')
    setTimeout(() => {
        document.getElementById('load').style.display = 'none'
    }, 500);

    if(user && user.uid) analytics.setUserId(user.uid)
    
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
                user: user,
                hostname: 'https://farman.info'
            },
            el: '#app',
            router,
            render: h => h(App)
        })

        // https://stackoverflow.com/a/36180348/11651419
        Vue.directive('click-outside', {
            bind: function (el, binding, vnode) {
                window.event = function (event) {
                    if (!(el == event.target || el.contains(event.target))) {
                        vnode.context[binding.expression](event);
                    }
                };
                document.body.addEventListener('click', window.event)
            },
            unbind: function (el) {
                document.body.removeEventListener('click', window.event)
            },
          
            stopProp(event) { event.stopPropagation() }
        })

        router.beforeEach((to, from, next) => {
            const noTransition = to.matched.some(x => x.meta.noTransition)
            if(noTransition === false) {
                app.loading.state = true
                window.scrollTo({top: 0, behavior: 'smooth'})
            }
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