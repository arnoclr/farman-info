<template>
    <div>
        <app-header></app-header>

        <main>
            <div>
                <md-field>
                    <label>Titre</label>
                    <md-input v-model="title"></md-input>
                </md-field>
                <text-editor :counter="4096" :change="updateContent"></text-editor>
                <md-field>
                <label for="category" v-if="categories">Catégorie</label>
                    <md-select v-model="category" name="category" id="category">
                        <md-option 
                            v-for="(category, id) in categories"
                            v-bind:key="id"
                            :value="id">{{ category.label }}</md-option>
                    </md-select>
                </md-field>
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
import {db} from '../../firebaseConfig'

export default {
    data() {
        return {
            title: '',
            content: '',
            category: null,
            categories: [],
        }
    },
    methods: {
        updateContent(value) {
            this.content = value
        },
        getCategories() {
            db.collection('categories').get().then(query => {
                query.forEach(doc => {
                    let buffer = doc.data()
                    buffer.id = doc.id
                    this.categories.push(buffer)
                })
            }).catch(err => {
                alert(err)
            })
        }
    },
    created() {
        this.getCategories()
    },
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        TextEditor: () => import('../utils/TextEditor.vue')
    },
}
</script>