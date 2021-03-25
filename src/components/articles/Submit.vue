<template>
    <div>
        <app-header></app-header>

        <main>
            <text-editor></text-editor>
        </main>

        <app-footer></app-footer>
    </div>
</template>

<script>
export default {
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        TextEditor: () => import('../utils/TextEditor.vue')
    },
}
</script>