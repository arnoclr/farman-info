<template>
    <div v-if="showInstallPromotion">
        <div class="fm-promotion-banner" v-if="mode === 'banner'">
            <img src="/assets/logos/icons-192.png" alt="logo myFarman" class="fm-promotion-banner__logo">
            <p>Installez l'application MyFarman et profitez de vos magazines et articles hors connexion. </p>
            <button class="fm-button fm-button--large" @click="install">
                Installer <i class="material-icons fm-button__icon fm-button__icon--right">get_app</i>
            </button>
        </div>
        <button class="fm-button" @click="install" v-else>Installer</button>
    </div>
</template>

<script>
import {analytics} from '../../firebaseConfig'

export default {
    props: ['mode'],
    computed: {
        showInstallPromotion: function() {
            return window.showInstallPromotion
        }
    },
    methods: {
        install() {
            // Hide the app provided install promotion
            window.showInstallPromotion = false
            // Show the install prompt
            window.deferredPrompt.prompt()
            // Wait for the user to respond to the prompt
            window.deferredPrompt.userChoice.then(outcome, () => {
                // Optionally, send analytics event with outcome of user choice
                console.log(`User response to the install prompt: ${outcome}`)
                analytics.logEvent('pwa_install', {
                    outcome: outcome
                })
            })
            // We've used the prompt, and can't use it again, throw it away
            window.deferredPrompt = null
        }
    }
}
</script>