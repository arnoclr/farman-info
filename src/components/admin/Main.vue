<template>
    <div>
        <app-header></app-header>

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