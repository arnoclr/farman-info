<template>
    <div>
        <app-header :gestion="true"></app-header>

        <div style="padding: 32px;">
            <md-field>
                <label for="section">Page</label>
                <md-select v-model="section" name="section" id="section">
                    <md-option value="magazines">Magazines</md-option>
                    <md-option value="articles">Articles</md-option>
                    <md-option value="mails">Newsletter</md-option>
                    <md-option value="remoteConfig">Annonces</md-option>
                </md-select>
            </md-field>

            <admin-mails v-if="section == 'mails'"></admin-mails>
            <admin-magazines v-if="section == 'magazines'"></admin-magazines>
            <admin-articles v-if="section == 'articles'"></admin-articles>
            <admin-remote-config  v-if="section == 'remoteConfig'"></admin-remote-config>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            section: this.$route.params.section || 'articles'
        }
    },
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        AdminMails: () => import('./Mails.vue'),
        AdminMagazines: () => import('./Magazines.vue'),
        AdminArticles: () => import('./Articles.vue'),
        AdminRemoteConfig: () => import('./RemoteConfig.vue')
    }
}
</script>