<template>
    <div>
        <app-header></app-header>

        <main>
            <div>
                <md-field>
                    <label>Titre</label>
                    <md-input v-model="title"></md-input>
                </md-field>
                <text-editor :change="updateContent"></text-editor>
            </div>

            <div>
                <vue-simple-markdown :source="content"></vue-simple-markdown>
            </div>
        </main>

        <app-footer></app-footer>
    </div>
</template>

<style lang="scss" scoped>
main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 32px;
}
</style>

<script>
export default {
    data() {
        return {
            title: '',
            content: '',
        }
    },
    methods: {
        updateContent(value) {
            this.content = value
        } 
    },
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        TextEditor: () => import('../utils/TextEditor.vue')
    },
}
</script>