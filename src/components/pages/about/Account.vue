<template>
    <div>
        <div class="fm-presentation">
            <app-header class="fm-header--transparent" transparent="true"></app-header>

            <img src="https://i.imgur.com/YhO60QV.jpg" alt="" class="fm-presentation__img">

            <main>
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
                            <h2></h2>
                            <p></p>
                        </div>
                    </div>

                    <div class="fm-presentation__grid-item">
                        <img class="fm-presentation__grid-item-img" src="/assets/logos/icons-192.png">
                        <div class="fm-presentation__grid-item-text">
                            <h2></h2>
                            <p></p>
                        </div>
                    </div>

                    <div class="fm-presentation__grid-item">
                        <i class="material-icons fm-presentation__grid-item-icon">edit</i>
                        <div class="fm-presentation__grid-item-text">
                            <h2></h2>
                            <p></p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
export default {
    components: {
        AppFooter: () => import('../../Footer.vue'),
        AppHeader: () => import('../../Navigation.vue')
    },
}
</script>