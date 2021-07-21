<template>
    <div>
        <div class="fm-presentation fm-presentation--offset-top">
            <div>
                <app-header class="fm-header--transparent" transparent="true"></app-header>
                <lazy-image blur-src="https://i.imgur.com/URinDhN.jpg" src="https://i.imgur.com/YhO60QV.jpgh" alt="" class="fm-presentation__img"></lazy-image>
            </div>

            <main>
                <div class="fm-presentation--absolute">
                    <div class="fm-presentation__title">
                        <h1>S'ouvrir au monde.</h1>
                        <h4>C'est ça le compte Farman.</h4>
                    </div>

                    <div class="fm-presentation__cta">
                        <div class="fm-presentation__cta-desc">
                            <i class="material-icons fm-presentation__cta-desc-icon">add_circle_outline</i>
                            <p class="fm-presentation__cta-desc-text">
                                Une offre de presse améliorée pour tous les passionnés d’aéro.
                            </p>
                        </div>
                        <div class="fm-presentation__cta-btn">
                            <router-link 
                            :to="{name: 'Login', params: {ref: 'about_account'}}"
                            class="fm-button fm-button--large fm-button--shadow"
                            :disabled="$root.user">
                                Créer mon compte
                                <i v-if="$root.user" class="material-icons fm-button__icon fm-button__icon--right">done</i>
                            </router-link>
                            <button @click="scrollDown" class="fm-button fm-button--large fm-button--white fm-button--shadow">
                                Découvrir l'offre
                            </button>
                        </div>
                    </div>
                </div>

                <h1 class="fm-presentation__title">
                    Les avantages d’un service payant en <span class="fm-presentation__title-important">100% gratuit</span>
                </h1>

                <div class="fm-presentation__grid">
                    <div class="fm-presentation__grid-item">
                        <i class="material-icons fm-presentation__grid-item-icon">monetization_on</i>
                        <div class="fm-presentation__grid-item-text">
                            <h2>Faites le choix de ne pas en faire.</h2>
                            <p>Ne vous souciez plus des tarifs et de votre porte monnaie.</p>
                            <p>Farman vous offre tous ses services gratuitement et sans pubs</p>
                        </div>
                    </div>

                    <div class="fm-presentation__grid-item">
                        <i class="material-icons fm-presentation__grid-item-icon">favorite</i>
                        <div class="fm-presentation__grid-item-text">
                            <h2>Des recommandations adaptées à vos envies.</h2>
                            <p>Grâce à nos profils personnalisés, vous recevez les articles, notifications et newsletters des sujets qui vous intéressent.</p>
                            <p>Profitez aussi des interactions sur nos articles avec les likes et commentaires.</p>
                        </div>
                    </div>

                    <div class="fm-presentation__grid-item">
                        <img class="fm-presentation__grid-item-img" src="/assets/logos/icons-192.png">
                        <div class="fm-presentation__grid-item-text">
                            <h2>Une application plus simple.</h2>
                            <p>Ajoutez à votre écran d’accueil l’extension MyFarman et accédez rapidement à tous vos articles favoris</p>
                            <p>Profitez aussi de la naviguation hors-connexion pour lire vos articles où que vous soyez</p>
                        </div>
                    </div>

                    <div class="fm-presentation__grid-item">
                        <i class="material-icons fm-presentation__grid-item-icon">edit</i>
                        <div class="fm-presentation__grid-item-text">
                            <h2>Devenez rédacteur, gagnez de l’argent.</h2>
                            <p>Avec notre mode rédaction, partagez vos passions et les sujets qui vous intéressent en écrivant des articles publics.</p>
                            <p class="fm-p fm-p--disabled">Bientôt disponible : Avec notre système de rémunération, générez de l'argent grâce à vos articles.</p>
                        </div>
                    </div>
                </div>

                <div class="fm-presentation__tiles">
                    <div class="fm-tile fm-tile--centered">
                        <h2 class="fm-tile__title fm-tile__title">Une communauté unie autour de passions communes</h2>
                        <div class="fm-tile__icons-list fm-tile__icons-list">
                            <div class="fm-tile__icons-list-item">
                                <svg class="fm-tile__icons-list-item-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5.68C12.5,5.68 12.95,6.11 12.95,6.63V10.11L18,13.26V14.53L12.95,12.95V16.42L14.21,17.37V18.32L12,17.68L9.79,18.32V17.37L11.05,16.42V12.95L6,14.53V13.26L11.05,10.11V6.63C11.05,6.11 11.5,5.68 12,5.68Z" />
                                </svg>
                                <span class="fm-tile__icons-list-item-label">Défense</span>
                            </div>
                            <div class="fm-tile__icons-list-item">
                                <svg class="fm-tile__icons-list-item-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12 9C13.59 16.61 10 22 10 22H13C14.88 16.2 14 12.09 13.5 10M15.66 7.16C15.83 7.37 16 7.59 16.13 7.82C17.84 10.53 17.5 13.95 15.5 16.26C16.34 14.21 16.22 11.79 14.95 9.77C14.87 9.64 14.78 9.53 14.7 9.41C14.11 8.58 13.36 7.92 12.54 7.43C9.66 8.35 7.58 11.04 7.58 14.22C7.58 14.96 7.69 15.67 7.89 16.33C7.05 15.16 6.56 13.73 6.56 12.19C6.56 9.84 7.7 7.76 9.45 6.46C8 6.35 6.46 6.67 5.12 7.5C4.5 7.91 3.96 8.38 3.5 8.91C4.05 7.58 5 6.39 6.3 5.57C7.8 4.63 9.5 4.32 11.14 4.56C10.73 4 10.23 3.47 9.63 3C9.05 2.58 8.42 2.24 7.76 2C9.2 2.04 10.64 2.5 11.87 3.43C12.5 3.9 13 4.47 13.4 5.07C13.5 5.07 13.59 5.06 13.69 5.06C16.89 5.06 19.6 7.17 20.5 10.08C19.38 8.5 17.65 7.43 15.66 7.16Z" />
                                </svg>
                                <span class="fm-tile__icons-list-item-label">Voyage</span>
                            </div>
                            <div class="fm-tile__icons-list-item">
                                <i class="material-icons fm-tile__icons-list-item-icon">flight_takeoff</i>
                                <span class="fm-tile__icons-list-item-label">Trafic aérien</span>
                            </div>
                            <div class="fm-tile__icons-list-item">
                                <svg class="material-icons fm-tile__icons-list-item-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20 22L16.14 20.45C16.84 18.92 17.34 17.34 17.65 15.73L20 22M7.86 20.45L4 22L6.35 15.73C6.66 17.34 7.16 18.92 7.86 20.45M12 2C12 2 17 4 17 12C17 15.1 16.25 17.75 15.33 19.83C15 20.55 14.29 21 13.5 21H10.5C9.71 21 9 20.55 8.67 19.83C7.76 17.75 7 15.1 7 12C7 4 12 2 12 2M12 12C13.1 12 14 11.1 14 10C14 8.9 13.1 8 12 8C10.9 8 10 8.9 10 10C10 11.1 10.9 12 12 12Z" />
                                </svg>
                                <span class="fm-tile__icons-list-item-label">Espace</span>
                            </div>
                        </div>
                    </div>

                    <div class="fm-tile fm-tile--colored fm-tile--centered">
                        <h2 class="fm-tile__title">Farman, le choix d’une éthique journalistique bénévole et citoyenne.</h2>
                        <p>Farman, c’est l’oeuvre d’une coopération de passionés d’aviation qui travaillent bénévolement sur la recherche de l’information et le développement de la communication numérique.</p>
                        <p>L’éthique journalistique est au coeur de notre ligne éditoriale avec la volonté de conserver une neutralité systématique sur les informations que nous délivrons.</p>
                    </div>

                    <div class="fm-presentation__tiles-duo">
                        <div class="fm-tile">
                            <h2 class="fm-tile__title fm-tile__title--small">Le <i class="material-icons fm-tile__title-icon fm-tile__title-icon-colored">add_circle_outline</i> du compte Farman</h2>
                            <h1 class="fm-tile__big-text"><ins>Des services</ins> qui vous suivent partout, <ins>pour vous</ins> <i class="material-icons">arrow_forwards</i></h1>
                            <small class="fm-tile__small-text">Une application dédiée pour naviguer hors-connexion et lire vos articles préférés.</small>
                        </div>

                        <div class="fm-tile">
                            <h2 class="fm-tile__title fm-tile__title--small">Le <i class="material-icons fm-tile__title-icon fm-tile__title-icon-colored">add_circle_outline</i> du compte Farman</h2>
                            <h1 class="fm-tile__big-text">Une information <ins>vraie</ins> et <ins>participative</ins> <i class="material-icons">arrow_forwards</i></h1>
                            <small class="fm-tile__small-text">Le compte Farman vous permet d’apporter des modifications à des articles.</small>
                        </div>
                    </div>
                </div>

                <div class="fm-presentation__cta-bottom">
                    <h1>Faites le pas, rejoignez la communauté du ciel <i class="material-icons">cloud</i></h1>
                    <router-link 
                    :to="{name: 'Login', params: {ref: 'about_account'}}"
                    class="fm-button fm-button--large"
                    :disabled="$root.user">
                        Créer mon compte
                        <i v-if="$root.user" class="material-icons fm-button__icon fm-button__icon--right">done</i>
                    </router-link>
                </div>

                <p class="fm-presentation__legal-disclaimer">
                    Tout utilisateur dispose d’un droit d’accès, de rectification et d’opposition aux données personnelles le concernant, en effectuant sa demande écrite et signée, accompagnée d’une preuve d’identité.
                    Le site ne recueille pas d’informations personnelles, et n’est pas assujetti à déclaration à la CNIL.
                    <br><br>
                    Crédits photo : <a target="_blank" rel="nofollow" href="https://unsplash.com/photos/sdCUrz3yfiM">Unsplash</a>
                </p>
            </main>
        </div>

        <app-footer :transparent="true" :reduced="true"></app-footer>
    </div>
</template>

<script>
export default {
    components: {
        AppFooter: () => import('../../Footer.vue'),
        AppHeader: () => import('../../Navigation.vue'),
        LazyImage: () => import('../../utils/LazyImage.vue')
    },
    methods: {
        scrollDown() {
            window.scroll({top: window.innerHeight, behavior: 'smooth'})
        }
    }
}
</script>