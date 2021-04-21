<template>
    <div>
        <app-header></app-header>
        
        <div r>
            <main>
                
                <div class="fm-card fm-card--img fm-card--full-width">
                    <div class="fm-card__img fm-card__img--left">
                        <img src="https://i.imgur.com/pReQ6Mz.jpg" alt="Thomas Pesquet">
                    </div>
                    <div class="fm-card__body">
                        <span class="fm-card__body-category">évènement en direct</span>
                        <h1 class="fm-card___body-title">Vivez en direct le décollage de Thomas Pesquet à bord de SpaceX.</h1>
                        <div class="fm-card__body-content">
                            <p>L'astronaute français va embarquer à bord de la deuxième mission habitée de SpaceX vers l'ISS. 
                                Regardez l'évènement sur le YouTube de Farman.</p>
                            <a role="button" href="https://farman.ga/s/live/spacex" class="fm-button">regarder</a>
                        </div>
                    </div>
                </div>

                <div class="mt-64 mb-64">
                    <h1>Ce site est partiellement disponible</h1>
                    <p>Ce site web n'est pas encore disponible au public. Seule la partie Magazine peut
                        être consultée en cliquant ci-dessous.</p>
                    <p>Farman propose une sélection d'informations sur l'aéronautique ainsi qu'une offre de
                        magazines lifestyle, culture & voyage.</p>
                    <router-link to="/magazines?ref=cta" class="fm-button fm-button--large">Lire le magazine</router-link>
                </div>

                <div class="fm-card fm-card--fullwidth">
                    <div class="fm-card__body">
                        <h1 class="fm-card__body-title fm-card__body-title--small">S’inscrire à notre lettre d’information</h1>
                        <div class="fm-card__body-content">
                            <form @submit.prevent="submit" id="mail-form" 
                                class="fm-textfield fm-textfield--button">
                                <input v-model="mail" type="email" id="mail-input" placeholder="Votre adresse email"
                                    class="fm-textfield__input" required>
                                <button class="fm-textfield__button fm-button">
                                    <md-icon>arrow_forward</md-icon>
                                </button>
                                <md-menu class="m-4" md-direction="top-end">
                                    <md-button md-menu-trigger class="md-icon-button">
                                        <md-icon>more_vert</md-icon>
                                    </md-button>

                                    <md-menu-content>
                                        <a target="_blank" href="https://farman.ga/s/newsletter">
                                            <md-menu-item>En savoir plus</md-menu-item>
                                        </a>
                                        <router-link to="/unsubscribe?ref=landing_page">
                                            <md-menu-item>Se désinscrire</md-menu-item>
                                        </router-link>
                                    </md-menu-content>
                                </md-menu>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<script>
const {db} = require('../firebaseConfig.js')

export default {
    components: {
        AppFooter: () => import('./Footer.vue'),
        AppHeader: () => import('./Navigation.vue'),
        AppSidebar: () => import('./utils/Sidebar.vue'),
        LazyImg: () => import('./utils/LazyImage')
    },
    data() {
        return {
            mail: '',
        }
    },
    methods: {
        submit() {
            db.collection('mails').add({
                mail: this.mail
            })
            .then(() => {
                this.mail = ''
                this.$root.$emit('alert', 'Merci ! Vous serez informé lorsque le site sera disponible.')
            })
            .catch(error => {
                console.error('Error adding document: ', error)
                this.$root.$emit('alert', 'Oops, une erreur est survenue.')
            })
        }
    }
}
</script>