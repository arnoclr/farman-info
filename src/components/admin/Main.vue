<template>
    <div>
        <app-header :gestion="true"></app-header>

        <main>
            <md-field class="select">
                <label for="section">Page</label>
                <md-select v-model="section" name="section" id="section">
                    <md-option value="magazines">Magazines</md-option>
                    <md-option value="mails">Newsletter</md-option>
                    <md-option value="annonces">Annonces</md-option>
                </md-select>
            </md-field>
            <admin-mails v-if="section == 'mails'"></admin-mails>
            <admin-magazines v-if="section == 'magazines'"></admin-magazines>
            <div v-if="section == 'annonces'">
                <a target="_blank" href="https://console.firebase.google.com/u/0/project/actualites-aeronautiques/config" class="button">Editer les bannières internes</a>
            </div>
        </main>

        <app-footer></app-footer>
    </div>
</template>

<style scoped>
.select {
    position: fixed;
    bottom: 16px;
    left: 16px;
    width: 100px;
    z-index: 2;
}
</style>

<script>
export default {
    data() {
        return {
            section: 'magazines'
        }
    },
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        AdminMails: () => import('./Mails.vue'),
        AdminMagazines: () => import('./Magazines.vue')
    }
}
</script>