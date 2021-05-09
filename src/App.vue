<template>
    <div>
        <md-progress-bar v-if="$root.loading.state" :md-mode="$root.loading.mode" pb></md-progress-bar>
        <div class="background" v-if="$root.loading.state"></div>

        <md-snackbar md-position="center" :md-duration="5000" :md-active.sync="$root.toast.open" md-persistent>
            <span>{{ $root.toast.value }}</span>
        </md-snackbar>

        <md-dialog-alert
            :md-active.sync="$root.alert.open"
            :md-content="$root.alert.value"
            md-confirm-text="OK" />

        <router-view/>

        <cookie-law
            button-text="Accepter" button-class="fm-button" 
            :button-decline="true" button-decline-text="Tout refuser" button-decline-class="fm-button fm-button--flat">
            <div slot="message">
                Ce site web utilise des cookies <a href="https://farman.ga/s/cgu">Informations complémentaires</a>
            </div>
        </cookie-law>
    </div>
</template>

<style scoped>
.Cookie {
    background: #fff;
}

.Cookie .button-outlined {
    margin: 0 !important;
}

[pb].md-progress-bar.md-theme-default {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #ddd;
    z-index: 3;
}

.background {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #fff;
    opacity: 0.6;
    z-index: 9;
}
</style>

<script>
    import Navigation from './components/Navigation.vue'
    import CookieLaw from 'vue-cookie-law'
    
    export default {
        components: {
            CookieLaw,
            Navigation
        }
    }
</script>