<template>
    <div>
        <app-header :gestion="true"></app-header>

        <div>
            <div>
                <md-steppers :md-active-step.sync="currentStep" md-linear>
                    <md-step id="general" md-label="Informatrions générales" 
                    :md-error="(!article.title || !article.thumbnail || !article.summary) && currentStep != 'general' ? 'Champs non remplis' : false">
                        <div class="fm-main-padding">
                            <md-field z>
                                <label>Titre</label>
                                <md-input md-counter="100" max="100" v-model="article.title" required></md-input>
                            </md-field>

                            <img height="160" :src="article.thumbnail">
                            <button class="fm-button" @click="imageUploaderOpen = true" v-if="article.thumbnail">Modifier la vignette</button>
                            <div class="fm-button-bloc" @click="imageUploaderOpen = true" v-else>
                                <md-icon>add</md-icon>
                                <span class="fm-button-bloc__label">Ajouter une image</span>
                            </div>
                            <image-uploader ref="uploader" :callback="insertThumb" :open.sync="imageUploaderOpen"></image-uploader>

                            <md-field>
                                <label>Chapeau</label>
                                <md-textarea md-counter="500" max="500" v-model="article.summary" required></md-textarea>
                            </md-field>

                            <div class="fm-button" @click="currentStep = 'content'">
                                Suivant <i class="material-icons fm-button__icon fm-button__icon-right">arrow_forward</i>
                            </div>
                        </div>
                    </md-step>

                    <md-step id="content" md-label="Corps de l'article">
                        <div class="fm-main-padding">
                            <text-editor :content.sync="article.content" :counter="10000" ref="textEditor"></text-editor>
                            <button class="fm-button fm-button--outlined" @click="deleteDraft">Supprimer mon brouillon</button>

                            <div class="fm-button" @click="currentStep = 'seo'">
                                Suivant <i class="material-icons fm-button__icon fm-button__icon-right">arrow_forward</i>
                            </div>
                        </div>
                    </md-step>

                    <md-step id="seo" md-label="Référencement">
                        <div class="fm-main-padding">
                            <md-field>
                                <label for="category" v-if="categories">Catégorie</label>
                                <md-select v-model="article.category" name="category" id="category" required>
                                    <md-option 
                                        v-for="(category, id) in categories"
                                        v-bind:key="id"
                                        :value="category.id">{{ category.label }}</md-option>
                                </md-select>
                            </md-field>

                            <md-switch v-model="article.breaking">A la une</md-switch>

                            <md-chips class="shake-on-error" v-model="article.tags" :md-limit="10" md-placeholder="Ajouter des tags"></md-chips>
                            <div class="md-helper-text">Les tags sont nécéssaires pour la recherche, ajoutez des mots simples qui décrivent au mieux votre article.</div>

                            <button class="fm-button fm-button--large fm-button--full" @click="submit" :disabled="submitting">{{ article.id ? 'Mettre à jour' : 'Soumettre'}}</button>

                            <span help v-if="article.id">Attention, vos modifications devront être revalidées pour que votre article soit a nouveau visible. Ce processus peut prendre un certain temps.</span>
                            <span help>Veuillez porter une attention toute particulière aux fautes d'orthographe et de formulation. Il peut s'agir d'un motif de refus.</span>
                            <span help>En continuant, vous confirmez avoir lu et approuvé nos <a target="_blank" href="https://farman.ga/s/cgu">conditions générales d'utilisation.</a></span>
                        </div>
                    </md-step>
                </md-steppers>
            </div>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<style lang="scss" scoped>
.shake-on-error /deep/ .md-duplicated {
    animation-name: shake;
    animation-duration: 0.5s;
}

@keyframes shake {
    0% { transform: translate(15px); }
    20% { transform: translate(-15px); }
    40% { transform: translate(7px); }
    60% { transform: translate(-7px); }
    80% { transform: translate(3px); }
    100% { transform: translate(0px); }
}

main {
    [z] {
        z-index: 1;
    }

    [help] {
        display: block;
        margin: 8px;
        color: #555;
    }
}
</style>

<script>
import {analytics, db, firebase} from '../../firebaseConfig'
import {getCategories} from '../../assets/js/firestore/getCategories'

const articles = db.collection('articles')
const EDITOR_TEMPLATE = `
# Ceci est un exemple

Voici un paragraphe et un début de mise en forme pour vous montrer comment fonctionne l'éditeur Farman.

## Chapeau 

Qui ? Quoi ? Où ? Comment ? Pourquoi ?

A vos stylos ...
`

export default {
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        TextEditor: () => import('../utils/TextEditor.vue'),
        imageUploader: () => import('../utils/ImageUploader')
    },
    data() {
        return {
            article: {
                title: '',
                thumbnail: null,
                summary: '',
                content: '',
                category: null,
                tags: []
            },
            currentStep: 'general',
            submitting: false,
            template: EDITOR_TEMPLATE,
            categories: false,
            imageUploaderOpen: false
        }
    },
    methods: {
        updateContent(text) {
            this.article.content = text
        },
        insertThumb(url) {
            this.article.thumbnail = url
        },
        submit() {
            this.submitting = true
            if(this.article.id)
                return this.updateArticle()
            if(this.article.title && this.article.thumbnail && this.article.summary && this.article.content && this.article.category && this.article.tags) {
                articles.add({
                    title: this.article.title,
                    thumbnail: this.article.thumbnail,
                    summary: this.article.summary,
                    content: this.article.content,
                    category: this.article.category,
                    breaking: this.article.breaking ? true : false,
                    tags: this.article.tags,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    uid: firebase.auth().currentUser.uid,
                    published: false
                })
                .then(doc => {
                    console.log(doc.id)
                    this.article.title = this.article.summary = this.article.content = this.article.category = null
                    localStorage.removeItem('submit:draft')
                    this.$router.push({name: 'articleView', params: {id: doc.id, ref: 'submit'}})
                    analytics.logEvent('publish_article')
                })
                .catch(err => {
                    alert(err)
                    this.submitting = false
                })
            } else {
                this.$root.$emit('toast', 'Champs non remplis')
                this.submitting = false
            }
        },
        updateArticle() {
            articles.doc(this.article.id).update({
                title: this.article.title,
                thumbnail: this.article.thumbnail,
                summary: this.article.summary,
                content: this.article.content,
                category: this.article.category,
                breaking: this.article.breaking ? true : false,
                tags: this.article.tags,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                published: false
            }).then(() => {
                this.$root.$emit('toast', 'Article mis à jour, vous allez être redirigé dans quelques secondes.')
                analytics.logEvent('save_article')
                setTimeout(() => {
                    this.$router.push({name: 'articleView', params: {id: this.article.id, ref: 'edit'}})
                }, 3000);
            }).catch(err => {
                this.$root.$emit('alert', err)
                console.error(err)
                this.submitting = false
            })
        },
        fetch(id) {
            articles.doc(id).get().then(doc => {
                this.article = doc.data()
                this.article.id = doc.id
                this.$refs.textEditor.initContent(this.article.content)
                if(this.article.uid != this.$root.user.uid) {
                    this.$root.$emit('alert', 'Vous ne pouvez pas modifier cet article')
                }
            }).catch(err => {
                this.$root.$emit('toast', err)
                console.error(err)
            })
        },
        deleteDraft() {
            if(!confirm('Supprimer le brouillon ?')) return
            this.$refs.textEditor.initContent(' ')
            localStorage.removeItem('submit:draft')
            window.location.reload()
        }
    },
    mounted() {
        this.categories = getCategories()

        const id = this.$route.params.id
        if(id) {
            this.fetch(id)
            analytics.logEvent('edit_article')
        } else {
            if (!localStorage.getItem('submit:draft')) {
                setTimeout(() => {
                    this.$refs.textEditor.initContent(this.template)
                }, 1000);
            }
            analytics.logEvent('write_article')
        }
    },
}
</script>