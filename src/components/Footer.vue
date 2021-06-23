<template>
    <div class="no-padding">
        <footer class="fm-footer">
            <div class="fm-footer__container">
                <h2>Retrouvez-nous sur <i class="material-icons">arrow_forward</i></h2>
                <p>Toute l'actualité aérienne française à découvrir sur vos réseaux sociaux.</p>
                <div class="fm-footer__container-social">
                    <a href="https://www.facebook.com/Farman-104565121316470" title="Page Facebook">
                        <img src="/assets/icons/Farman_Facebook.png" alt="facebook icon" height="24">
                    </a>
                    <a href="https://twitter.com/ActualitsArona1" title="Page Twitter">
                        <img src="/assets/icons/Farman_Twitter.png" alt="twitter icon" height="24">
                    </a>
                    <a href="https://www.instagram.com/farman.info/" title="Page Instagram">
                        <img src="/assets/icons/Farman_Instagram.png" alt="instagram icon" height="24">
                    </a>
                    <a href="https://www.youtube.com/channel/UC9oYwEaRK3Bv68G-bKe-l_Q" title="Chaine Youtube">
                        <img src="/assets/icons/Farman_YouTube.png" alt="youtube icon" height="24">
                    </a>
                </div>
            </div>
            <div class="fm-footer__links">
                <p></p>
                <p><router-link class="fm-link" :to="{name: 'LandingPage', params: {ref: 'footer_copyright'}}">
                    ©{{ new Date().getFullYear() }} Farman</router-link>, mis à jour {{ buildDate }}</p>
                <p><a class="fm-link" href="https://farman.ga/s/cgu">Informations juridiques <i class="material-icons">open_in_new</i></a></p>
                <p><router-link class="fm-link" :to="{name: 'contact', params: {ref: 'footer'}}">Contact</router-link></p>
                <p></p>
            </div>
        </footer>
    </div>
</template>

<script>
import { format } from '../assets/js/utils/timeago'

export default {
    data() {
        return {
            buildDate: format(document.documentElement.dataset.buildTimestampUtc, 'fr_FR')
        }
    }
}
</script>