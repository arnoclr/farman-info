<template>
    <div v-if="!showInstallPromotion">
        <div class="fm-promotion-banner" v-if="mode === 'banner'">
            <img src="/assets/logos/icons-192.png" alt="logo myFarman" class="fm-promotion-banner__logo">
            <p>Installez l'application MyFarman et profitez de vos magazines et articles hors connexion.</p>
            <button class="fm-button fm-button--large" @click="install">Installer</button>
        </div>
        <button class="fm-button" @click="install" v-else>Installer</button>
    </div>
</template>

<script>
import {analytics} from '../../firebaseConfig'

export default {
    props: ['mode'],
    data() {
        return {
            // Initialize deferredPrompt for use later to show browser install prompt.
            deferredPrompt: null,
            showInstallPromotion: false
        }
    },
    mounted() {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault()
            // Stash the event so it can be triggered later.
            this.deferredPrompt = e
            // Update UI notify the user they can install the PWA
            this.showInstallPromotion = true
            // Optionally, send analytics event that PWA install promo was shown.
            console.log(`'beforeinstallprompt' event was fired.`)
        });
    },
    methods: {
        install() {
            // Hide the app provided install promotion
            this.showInstallPromotion = false
            // Show the install prompt
            this.deferredPrompt.prompt()
            // Wait for the user to respond to the prompt
            this.deferredPrompt.userChoice.then(outcome, () => {
                // Optionally, send analytics event with outcome of user choice
                console.log(`User response to the install prompt: ${outcome}`)
                analytics.logEvent('pwa_install', {
                    outcome: outcome
                })
            })
            // We've used the prompt, and can't use it again, throw it away
            this.deferredPrompt = null
        }
    }
}
</script>