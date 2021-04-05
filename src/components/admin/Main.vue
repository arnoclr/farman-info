<template>
    <div>
        <app-header :gestion="true"></app-header>

        <main>
            <div class="card" :class="menuOpen ? 'open' : ''">
                <md-card>
                    <md-card-header>
                        <div class="md-title">Sections</div>
                    </md-card-header>
                    <md-card-content>
                        <md-field>
                            <label for="section">Page</label>
                            <md-select v-model="section" name="section" id="section">
                                <md-option value="magazines">Magazines</md-option>
                                <md-option value="articles">Articles</md-option>
                                <md-option value="mails">Newsletter</md-option>
                                <md-option value="remoteConfig">Annonces</md-option>
                            </md-select>
                        </md-field>
                    </md-card-content>
                </md-card>
                <md-button class="md-icon-button md-raised" @click="menuOpen = !menuOpen">
                    <md-icon>arrow_forward_ios</md-icon>
                </md-button>
            </div>

            <admin-mails v-if="section == 'mails'"></admin-mails>
            <admin-magazines v-if="section == 'magazines'"></admin-magazines>
            <admin-articles v-if="section == 'articles'"></admin-articles>
            <admin-remote-config  v-if="section == 'remoteConfig'"></admin-remote-config>
        </main>

        <app-footer></app-footer>
    </div>
</template>

<style lang="scss" scoped>
.card {
    position: fixed;
    bottom: 16px;
    left: 0;
    z-index: 2;
    transform: translateX(-285px);
    transition: transform 350ms ease-out;

    button, .md-card {
        display: inline-block;
        vertical-align: bottom;
    }

    button {
        margin-left: 16px;

        i {
            transform: rotate(0);
            transition: transform 150ms ease 350ms;
        }
    }

    &.open {
        transform: translate(16px);

        button i {
            transform: rotate(180deg);
        }
    }
}
</style>

<script>
export default {
    data() {
        return {
            section: this.$route.params.section || 'articles',
            menuOpen: false
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