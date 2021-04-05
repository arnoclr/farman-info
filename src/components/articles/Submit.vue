<template>
    <div>
        <app-header :gestion="true"></app-header>

        <main>
            <form>
                <md-tabs id="submit-article-tabs">
                    <md-tab md-label="édition">
                        <md-field>
                            <label>Titre</label>
                            <md-input md-counter="80" max="80" v-model="article.title" required></md-input>
                        </md-field>

                        <text-editor :content.sync="article.content" :counter="4096"></text-editor>
                        
                        <md-field>
                            <label for="category" v-if="categories">Catégorie</label>
                            <md-select v-model="article.category" name="category" id="category" required>
                                <md-option 
                                    v-for="(category, id) in categories"
                                    v-bind:key="id"
                                    :value="category.id">{{ category.label }}</md-option>
                            </md-select>
                        </md-field>

                        <md-chips v-model="article.tags" md-placeholder="Ajouter des tags"></md-chips>
                        <div class="md-helper-text">Les tags sont nécéssaires pour la recherche, ajoutez des mots simples qui décrivent au mieux votre article.</div>
                    </md-tab>
                    <md-tab md-label="prévisualisation" v-if="isMobile">
                        <vue-simple-markdown v-if="article.content" :source="article.content"></vue-simple-markdown>
                    </md-tab>
                </md-tabs>

                <md-button class="md-raised md-primary" @click="submit">{{ article.id ? 'Mettre à jour' : 'Soumettre'}}</md-button>
                <span revalidate v-if="article.id">Attention, vos modifications devront être revalidées pour que votre article soit a nouveau visible. Ce processus peut prendre un certain temps.</span>
            </form>

            <div preview-desktop>
                <vue-simple-markdown v-if="article.content" :source="article.content"></vue-simple-markdown>
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

    [revalidate] {
        display: block;
        margin: 8px;
        color: #555;
    }
}

@media screen and(max-width: 1200px) {
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
#submit-article-tabs .md-tabs-content {
    height: auto !important;
}
</style>

<script>
import {db, firebase} from '../../firebaseConfig'
import {getCategories} from '../../assets/js/firestore/getCategories'
const articles = db.collection('articles')

export default {
    data() {
        return {
            article: {
                title: '',
                content: '',
                category: null,
                tags: []
            },
            categories: false,
            isMobile: window.matchMedia('only screen and (max-width: 1200px)').matches,
        }
    },
    methods: {
        updateContent(text) {
            this.article.content = text
        },
        submit() {
            if(this.article.id)
                return this.updateArticle()
            if(this.article.title && this.article.content && this.article.category && this.article.tags) {
                articles.add({
                    title: this.article.title,
                    content: this.article.content,
                    category: this.article.category,
                    tags: this.article.tags,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    uid: firebase.auth().currentUser.uid,
                    published: false
                })
                .then(doc => {
                    console.log(doc.id)
                    this.article.title = this.article.content = this.article.category = null
                    localStorage.removeItem('submit:draft')
                    this.$router.push('/article/' + doc.id + '?ref=submit_page')
                })
                .catch(err => {
                    alert(err)
                })
            } else {
                this.$root.$emit('toast', 'Champs non remplis')
            }
        },
        updateArticle() {
            articles.doc(this.article.id).update({
                title: this.article.title,
                content: this.article.content,
                category: this.article.category,
                tags: this.article.tags,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                published: false
            }).then(() => {
                this.$root.$emit('toast', 'Article mis à jour')
            }).catch(err => {
                this.$root.$emit('alert', err)
                console.error(err)
            })
        },
        fetch(id) {
            articles.doc(id).get().then(doc => {
                this.article = doc.data()
                this.article.id = doc.id
            }).catch(err => {
                this.$root.$emit('toast', err)
                console.error(err)
            })
        }
    },
    created() {
        this.categories = getCategories()

        const id = this.$route.params.ref
        if(id) {
            this.fetch(id)
        }

        window.addEventListener('resize', () => {
            this.isMobile = window.matchMedia('only screen and (max-width: 1200px)').matches
        })
    },
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        TextEditor: () => import('../utils/TextEditor.vue')
    },
}
</script>