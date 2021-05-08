<template>
    <div>
        <app-header></app-header>
        
        <div r>
            <main>
                
                <div class="fm-section fm-section--full-height">
                    <div class="fm-section__centered">
                        <div class="fm-card fm-card--img fm-card--full-width">
                            <div class="fm-card__img fm-card__img--left">
                                <img loading="lazy" src="https://i.imgur.com/pReQ6Mz.jpg" alt="Thomas Pesquet">
                            </div>
                            <div class="fm-card__body">
                                <span class="fm-card__body-category">rediffusion</span>
                                <h1 class="fm-card__body-title">Revivez en direct le décollage de Thomas Pesquet à bord de SpaceX.</h1>
                                <div class="fm-card__body-content">
                                    <p>L'astronaute français va embarquer à bord de la deuxième mission habitée de SpaceX vers l'ISS. 
                                        Regardez l'évènement sur le YouTube de Farman.</p>
                                    <a role="button" href="https://www.youtube.com/watch?v=irrjR01x31I" class="fm-button">regarder</a>
                                </div>
                            </div>
                        </div>

                        <div class="fm-card fm-card--img fm-card--full-width">
                            <div class="fm-card__img fm-card__img--left">
                                <img loading="lazy" src="https://i.imgur.com/t6gw80c.jpg" alt="Thomas Pesquet">
                            </div>
                            <div class="fm-card__body">
                                <span class="fm-card__body-category">YouTube</span>
                                <h1 class="fm-card__body-title">Découvrez Farman sur YouTube</h1>
                                <div class="fm-card__body-content">
                                    <a role="button" href="https://farman.ga/s/direct" class="fm-button">regarder</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- <h2>Dernières informations</h2>
                <div class="fm-grid" v-if="articles">
                    <router-link 
                        style="text-decoration: none; display: inline-block"
                        :to="'/article/' + article.id + '?ref=article_view_suggestions'"
                        v-for="(article, index) in articles" :key="index">
                        <div class="fm-card fm-card--img fm-card--medium">
                            <div class="fm-card__img">
                                <img :src="getImageFromContent(article.content)" :alt="article.title">
                            </div>
                            <div class="fm-card__body">
                                <h1 class="fm-card__body-title">{{ article.title }}</h1>
                                <div class="fm-card__body-content">
                                    <p>{{ removeMdFromContent(article.content).substring(0, 150) }}</p>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div> -->
                
                <div v-if="categories">
                    <div v-for="(category, index) in categories" :key="index">
                        <div v-if="articlesByCategories[category.id].length > 2">
                            <h2>{{ category.label }}</h2>
                            <p>{{ category.description }}</p>
                            <div class="fm-section fm-section--scrollable">
                                <router-link 
                                    class="item" style="text-decoration: none"
                                    :to="'/article/' + article.id + '?ref=landing_page_horizontal_scroll'"
                                    v-for="(article, index) in articlesByCategories[category.id]" :key="index">
                                    <div class="fm-card fm-card--img fm-card--medium">
                                        <div class="fm-card__img">
                                            <img :src="getImageFromContent(article.content)" :alt="article.title">
                                        </div>
                                        <div class="fm-card__body">
                                            <h1 class="fm-card__body-title">{{ article.title }}</h1>
                                            <div class="fm-card__body-content">
                                                <p>{{ removeMdFromContent(article.content).substring(0, 150) }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>
                                <div class="item">
                                    <router-link
                                        :to="'/articles/category/' + category.id + '?ref=landing_page_horizontal_scroll'"
                                        class="fm-button fm-button--outlined fm-button--square fm-button--grey">
                                        <i class="material-icons">arrow_forward</i>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fm-section fm-section--center" style="height:600px" v-if="articlesHorizontalLoading">
                    <div class="fm-section__centered-item">
                        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
                    </div>
                </div>

                <div class="fm-card fm-card--fullwidth">
                    <div class="fm-card__body">
                        <h1 class="fm-card__body-title fm-card__body-title--small">S’inscrire à notre lettre d’information</h1>
                        <div class="fm-card__body-content">
                            <form @submit.prevent="submit" id="mail-form" 
                                class="fm-textfield fm-textfield--button">
                                <input v-model="mail" type="email" id="mail-input" placeholder="Votre adresse email"
                                    class="fm-textfield__input" required>
                                <button class="fm-textfield__button fm-button">
                                    <md-icon>arrow_forward</md-icon>
                                </button>
                                <md-menu class="m-4" md-direction="top-end">
                                    <md-button md-menu-trigger class="md-icon-button">
                                        <md-icon>more_vert</md-icon>
                                    </md-button>

                                    <md-menu-content>
                                        <a target="_blank" href="https://farman.ga/s/newsletter">
                                            <md-menu-item>En savoir plus</md-menu-item>
                                        </a>
                                        <router-link to="/unsubscribe?ref=landing_page" title="Vous devez être connecté">
                                            <md-menu-item>Se désinscrire</md-menu-item>
                                        </router-link>
                                    </md-menu-content>
                                </md-menu>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<script>
const {db} = require('../firebaseConfig.js')
import {getCategories} from '../assets/js/firestore/getCategories'
import {articleCardMixin} from '../mixins/articlesCard'

export default {
    components: {
        AppFooter: () => import('./Footer.vue'),
        AppHeader: () => import('./Navigation.vue'),
        AppSidebar: () => import('./utils/Sidebar.vue'),
        LazyImg: () => import('./utils/LazyImage')
    },
    mixins: [articleCardMixin],
    data() {
        return {
            mail: '',
            articles: [],
            categories: [],
            articlesHorizontalLoading: true
        }
    },
    methods: {
        submit() {
            db.collection('mails').add({
                mail: this.mail
            })
            .then(() => {
                this.mail = ''
                this.$root.$emit('alert', 'Merci ! Vous serez informé lorsque le site sera disponible.')
            })
            .catch(error => {
                console.error('Error adding document: ', error)
                this.$root.$emit('alert', 'Oops, une erreur est survenue.')
            })
        },
        fetchArticles() {
            db.collection('articles').orderBy('createdAt', 'desc').where('published', '==', true).limit(15).get()
            .then(docs => {
                docs.forEach(doc => {
                    this.articles.push({id: doc.id, ...doc.data()})
                })
                this.articlesHorizontalLoading = false
            })
            .catch(e => this.articlesHorizontalLoading = false)
        }
    },
    computed: {
        articlesByCategories: function() {
            if(this.categories == undefined || this.articles == undefined) return
            let buffer = {}
            this.categories.forEach(category => {
                buffer[category.id] = this.articles.filter(x => x.category === category.id)
            })
            return buffer
        }
    },
    mounted() {
        this.fetchArticles()
        this.categories = getCategories()
    }
}
</script>