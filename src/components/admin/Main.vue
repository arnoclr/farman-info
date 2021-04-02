<template>
    <div>
        <app-header :gestion="true"></app-header>

        <main>
            <select v-model="section">
                <option>magazines</option>
                <option>mails</option>
            </select>
            <admin-mails v-if="section == 'mails'"></admin-mails>
            <admin-magazines v-if="section == 'magazines'"></admin-magazines>
        </main>

        <app-footer></app-footer>
    </div>
</template>

<style scoped>
select {
    position: fixed;
    bottom: 16px;
    left: 16px;
    z-index: 2;
    background-color: #fff;
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