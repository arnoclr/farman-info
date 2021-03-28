<template>
    <div>
        <md-progress-bar v-if="$root.loading" md-mode="indeterminate" pb></md-progress-bar>
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