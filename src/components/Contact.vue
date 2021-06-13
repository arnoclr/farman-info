<template>
    <div>
        <app-header></app-header>

        <main>
            <h1>Contacter Farman</h1>
            <p><b>Une remarque à propos d'une information ?</b><br>
            Contactez la rédaction de Farman via l'adresse suivante : <br>
            <a class="fm-link" href="mailto:farman.bonjour@outlook.fr">farman.bonjour@outlook.fr</a><br>
            Nous sommes a votre écoute du lundi au vendredi de 8h à 20h.</p>

            <p><b>Pour toute question ou réclamation,</b> contactez-nous par message privé sur nos réseaux sociaux.</p>

            <p><b>Une demande d'image ou un problème concernant vos droits ?</b><br>
            Faites une réclamation auprès de notre service par mail.</p>
        </main>

        <app-footer></app-footer>
    </div>
</template>

<script>
export default {
    components: {
        AppHeader: () => import('./Navigation.vue'),
        AppFooter: () => import('./Footer.vue')
    }
}
</script>