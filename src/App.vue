<template>
    <div>
        <md-progress-bar v-if="$root.loading.state" :md-mode="$root.loading.mode" pb></md-progress-bar>
        <router-view/>
        <cookie-law
            button-text="Accepter" button-class="button" 
            :button-decline="true" button-decline-text="Tout refuser" button-decline-class="button-outlined">
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