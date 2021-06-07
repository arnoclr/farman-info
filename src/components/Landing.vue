<template>
    <div>
        <app-header></app-header>
        <div class="fm-promotion-banner" v-if="!notificationsEnabled">
            <p>Activez les notifications et tenez-vous informé de la sortie de nouveaux magazines ou d'articles importants.</p>
            <button class="fm-button fm-button--large" @click="requestNotifications">Me notifier</button>
        </div>
        <install-button mode="banner" v-else></install-button>
        
        <div r>
            <main>
                
                <div class="fm-section fm-section--full-height" v-if="breakings.length > 0">
                    <div class="fm-section__centered">
                        <div class="fm-card fm-card--img fm-card--full-width" v-for="(article, index) in breakings" :key="index">
                            <div class="fm-card__img fm-card__img--left">
                                <img loading="lazy" :src="article.thumbnail" :alt="article.title">
                            </div>
                            <div class="fm-card__body">
                                <span class="fm-card__body-category fm-card__body-category--breaking" v-if="categories">à la une</span>
                                <h1 class="fm-card__body-title">{{ article.title }}</h1>
                                <div class="fm-card__body-content">
                                    <p>{{ article.summary }}</p>
                                    <router-link role="button" class="fm-button fm-button--large"
                                    :to="{name: 'articleView', params: {id: article.id, ref: 'landing_breaking'}}">lire</router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fm-section fm-section--center" style="height:90vh" v-else>
                    <div class="fm-section__centered-item">
                        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
                    </div>
                </div>

                <h2>Dernières informations</h2>
                <div 
                class="fm-grid fm-grid--landing"
                v-if="articlesByCategories.other">
                    <router-link
                    style="text-decoration: none; display: inline-block;"
                    :to="{name: 'articleView', params: {id: article.id, ref: 'landing_page_main'}}"
                    v-for="(article, index) in articlesByCategories.other" :key="index">
                        <div class="fm-card fm-card--img fm-card-fullwidth">
                            <div class="fm-card__img fm-card__img--small">
                                <img loading="lazy" :src="article.thumbnail" :alt="article.title">
                            </div>
                            <div class="fm-card__body">
                                <h1 class="fm-card__body-title">{{ article.title }}</h1>
                                <div class="fm-card__body-content">
                                    <p>{{ article.summary }}</p>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
                
                <div v-if="categories">
                    <div v-for="(category, index) in categories" :key="index">
                        <div v-if="articlesByCategories[category.id]">
                            <h2>{{ category.label }}</h2>
                            <p>{{ category.description }}</p>
                            <div class="fm-section fm-section--scrollable">
                                <router-link 
                                class="item" style="text-decoration: none"
                                :to="{name: 'articleView', params: {id: article.id, ref: 'landing_page_category_scroll'}}"
                                v-for="(article, index) in articlesByCategories[category.id]" :key="index">
                                    <div class="fm-card fm-card--img fm-card--medium">
                                        <div class="fm-card__img">
                                            <img :src="article.thumbnail" :alt="article.title">
                                        </div>
                                        <div class="fm-card__body">
                                            <h1 class="fm-card__body-title">{{ article.title }}</h1>
                                            <div class="fm-card__body-content">
                                                <p>{{ article.summary }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>
                                <div class="item">
                                    <router-link
                                        :to="{name: 'articleListCategory', params: {category: category.id, ref: 'landing_page_category_scroll'}}"
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
                                        <md-icon>{{ $device.ios ? 'more_horiz' : 'more_vert' }}</md-icon>
                                    </md-button>

                                    <md-menu-content>
                                        <a target="_blank" href="https://farman.ga/s/newsletter">
                                            <md-menu-item>En savoir plus</md-menu-item>
                                        </a>
                                        <router-link :to="{name: 'Unsubscribe', params: {ref: 'landing'}}" title="Vous devez être connecté">
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
import {notificationsMixin} from '../mixins/notifications'

export default {
    components: {
        AppFooter: () => import('./Footer.vue'),
        AppHeader: () => import('./Navigation.vue'),
        AppSidebar: () => import('./utils/Sidebar.vue'),
        InstallButton: () => import('./utils/installButton.vue')
    },
    mixins: [notificationsMixin],
    data() {
        return {
            mail: '',
            articles: [],
            breakings: [],
            categories: [],
            articlesHorizontalLoading: true
        }
    },
    metaInfo() {
        return {
            title: 'Farman - Actualités aéronautiques',
            link: [
                { rel: 'canonical', href: this.$root.hostname }
            ]
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
        },
        fetchBreaking() {
            db.collection('articles').where('published', '==', true).where('breaking', '==', true).orderBy('createdAt', 'desc').limit(2).get()
            .then(docs => {
                docs.forEach(doc => {
                    this.breakings.push({id: doc.id, ...doc.data()})
                })
            })
        }
    },
    computed: {
        articlesByCategories: function() {
            if(this.categories == undefined || this.articles == undefined) return
            let buffer = {other: []}
            this.categories.forEach(category => {
                let buffer2 = this.articles.filter(x => x.category === category.id)
                if(buffer2.length > 3) {
                    buffer[category.id] = buffer2
                } else {
                    buffer[category.id] = false
                    buffer2.forEach(i => {
                        buffer.other.push(i)
                    })
                }
            })
            return buffer
        }
    },
    mounted() {
        this.fetchBreaking()
        this.fetchArticles()
        this.categories = getCategories()
    }
}
</script>