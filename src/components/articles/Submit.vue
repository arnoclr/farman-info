<template>
    <div>
        <app-header :gestion="true"></app-header>

        <main>
            <form>
                <md-tabs id="submit-article-tabs">
                    <md-tab md-label="édition">
                        <md-field>
                            <label>Titre</label>
                            <md-input md-counter="80" max="80" v-model="title" required></md-input>
                        </md-field>
                        <text-editor :counter="4096" :change="updateContent"></text-editor>
                        <md-field>
                        <label for="category" v-if="categories">Catégorie</label>
                            <md-select v-model="category" name="category" id="category" required>
                                <md-option 
                                    v-for="(category, id) in categories"
                                    v-bind:key="id"
                                    :value="id">{{ category.label }}</md-option>
                            </md-select>
                        </md-field>
                    </md-tab>
                    <md-tab md-label="prévisualisation" v-if="isMobile">
                        <vue-simple-markdown v-if="content" :source="content"></vue-simple-markdown>
                    </md-tab>
                </md-tabs>

                <md-button class="md-raised md-primary">Soumettre</md-button>
            </form>

            <div preview-desktop>
                <vue-simple-markdown v-if="content" :source="content"></vue-simple-markdown>
                <md-empty-state v-else
                    md-icon="edit"
                    md-label="Aperçu"
                    md-description="Commencez a écrire pour voir le rendu final de votre article.">
                </md-empty-state>
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

@media screen and(max-width: 800px) {
    main {
        grid-template-columns: 1fr;
        column-gap: 8px;

        [preview-desktop] {
            display: none;
        }
    }
}
</style>

<style>
#submit-article-tabs .md-tabs-navigation {
    position: sticky;
    top: 70px;
    background-color: #fff;
    z-index: 1;
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
            categories: false,
            isMobile: window.matchMedia('only screen and (max-width: 800px)').matches,
        }
    },
    methods: {
        updateContent(value) {
            this.content = value
        },
        getCategories() {
            db.collection('categories').get().then(query => {
                this.categories = []
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
        window.addEventListener('resize', () => {
            this.isMobile = window.matchMedia('only screen and (max-width: 800px)').matches
        })
    },
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        TextEditor: () => import('../utils/TextEditor.vue')
    },
}
</script>