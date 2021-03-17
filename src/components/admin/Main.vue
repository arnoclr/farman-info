<template>
    <div>
        <app-header></app-header>

        <div>
            <select v-model="section">
                <option>principale</option>
                <option>mails</option>
            </select>
            <admin-mails v-if="section == 'mails'"></admin-mails>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            section: 'principale'
        }
    },
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        AdminMails: () => import('./Mails.vue')
    }
}
</script>