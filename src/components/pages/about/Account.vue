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
                            <router-link :to="{name: 'Login', params: {ref: 'about_account'}}"
                            class="fm-button fm-button--large fm-button--shadow">
                                Créer mon compte
                            </router-link>
                            <a href="" class="fm-button fm-button--large fm-button--white fm-button--shadow">
                                Découvrir l'offre
                            </a>
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
                            <p>Récoltez de l’argent avec les pubs générées sur vos articles.</p>
                        </div>
                    </div>
                </div>

                <div class="fm-presentation__tiles">
                    <div class="fm-tile fm-tile--centered">
                        <h2 class="fm-tile__title fm-tile__title">Une communauté unie autour de passions communes</h2>
                        <div class="fm-tile__icons-list fm-tile__icons-list">
                            <div class="fm-tile__icons-list-item">
                                <i class="material-icons fm-tile__icons-list-item-icon">military_tech</i>
                                <span class="fm-tile__icons-list-item-label">Défense</span>
                            </div>
                            <div class="fm-tile__icons-list-item">
                                <i class="material-icons fm-tile__icons-list-item-icon">travel_explore</i>
                                <span class="fm-tile__icons-list-item-label">Voyage</span>
                            </div>
                            <div class="fm-tile__icons-list-item">
                                <i class="material-icons fm-tile__icons-list-item-icon">flight_takeoff</i>
                                <span class="fm-tile__icons-list-item-label">Trafic aérien</span>
                            </div>
                            <div class="fm-tile__icons-list-item">
                                <i class="material-icons fm-tile__icons-list-item-icon">public</i>
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
                            <h2 class="fm-tile__title">Le <i class="material-icons fm-tile__title-icon fm-tile__title-icon-colored">add_circle_outline</i> du compte Farman</h2>
                            <h1 class="fm-tile__big-text"><ins>Des services</ins> qui vous suivent partout, <ins>pour vous</ins> <i class="material-icons">arrow_forwards</i></h1>
                            <small class="fm-tile__small-text">Une application dédiée pour naviguer hors-connexion et lire vos articles préférés.</small>
                        </div>

                        <div class="fm-tile">
                            <h2 class="fm-tile__title">Le <i class="material-icons fm-tile__title-icon fm-tile__title-icon-colored">add_circle_outline</i> du compte Farman</h2>
                            <h1 class="fm-tile__big-text">Une information <ins>vraie</ins> et <ins>participative</ins> <i class="material-icons">arrow_forwards</i></h1>
                            <small class="fm-tile__small-text">Le compte Farman vous permet d’apporter des modifications à des articles.</small>
                        </div>
                    </div>
                </div>

                <p>Tout utilisateur dispose d’un droit d’accès, de rectification et d’opposition aux données personnelles le concernant, en effectuant sa demande écrite et signée, accompagnée d’une preuve d’identité. Le site ne recueille pas d’informations personnelles, et n’est pas assujetti à déclaration à la CNIL.</p>
            </main>
        </div>
    </div>
</template>

<script>
export default {
    components: {
        AppFooter: () => import('../../Footer.vue'),
        AppHeader: () => import('../../Navigation.vue'),
        LazyImage: () => import('../../utils/LazyImage.vue')
    },
}
</script>