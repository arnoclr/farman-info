<template>
    <div>
        <app-header></app-header>

        <div>
            <main>
                <div class="box">
                    <span>
                        Articles
                        {{ $route.params.author ? '> Par auteur' : '' }}
                        {{ $route.params.category ? '> Categories > ' + categories.find(o => o.id == $route.params.category).label : '' }}
                    </span>
                    <h1>Les derniers articles</h1>
                    <p>Découvrez les derniers articles de la rédaction et des utilisateurs.</p>
                </div>

                <div v-if="articles">
                    <article v-for="(article, index) in articles" v-bind:key="index">
                        <router-link :to="{name: 'articleView', params: {id: article.id, ref: 'feed'}}"
                            class="fm-card fm-card--img fm-card--full-width"
                            :disabled="!article.published" style="pointer-events: inherit">
                            <div class="fm-card__img fm-card__img--left fm-card__img--limited-height">
                                <img :src="article.thumbnail" :alt="article.title">
                            </div>
                            <div class="fm-card__body fm-card__body--responsive fm-card__body--date">
                                <router-link 
                                    :to="{name: 'articleListCategory', params: {category: article.category, ref: 'articles_feed'}}"
                                    class="fm-card__body-category" v-if="categories">
                                    {{ categories.find(o => o.id == article.category) ? categories.find(o => o.id == article.category).label : '' }}
                                </router-link>
                                <h1 class="fm-card__body-title">
                                    <i class="material-icons fm-card__body-title-icon fm-card__body-title-icon--colored" v-if="article.needLogin">lock</i>
                                    {{ article.title }}
                                </h1>
                                <div class="fm-card__body-content">
                                    <p>{{ article.summary }}</p>
                                </div>
                                <span class="fm-card__body-date">
                                    {{ new Date(article.createdAt.seconds*1000).toLocaleDateString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
                                </span>
                            </div>
                        </router-link>
                    </article>
                    <button class="fm-button" @click="fetch">afficher plus</button>
                </div>
            </main>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<script>
import { db, auth, analyticsInstance } from '../../firebaseConfig'
import { collection, query, where, orderBy, startAfter, limit, getDocs } from 'firebase/firestore'
import { logEvent } from 'firebase/analytics'
import { getCategories } from '../../assets/js/firestore/getCategories'

export default {
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        CategoryLabel: () => import('../utils/CategoryLabel')
    },
    data() {
        return {
            articles: null,
            lastVisible: null,
            categories: null
        }
    },
    metaInfo() {
        return {
            title: 'Farman - Les articles',
            link: [
                { rel: 'canonical', href: this.$root.hostname + '/articles' }
            ]
        }
    },
    watch: {
        '$route.path': function(val, oldVal) {
            this.articles = this.lastVisible = null
            this.fetch()
        }
    },
    methods: {
        async fetch() {
            let category = this.$route.params.category
            let author = this.$route.params.author
            this.$root.$emit('query:loading')

            let constraints = []
            if(auth.currentUser && author && auth.currentUser.uid == author) {
                document.title = 'Mes articles'
            } else {
                constraints.push(where('published', '==', true))
            }
            if (category) constraints.push(where('category', '==', category))
            if (author) constraints.push(where('uid', '==', author))
            if (this.lastVisible) {
                constraints.push(startAfter(this.lastVisible.createdAt))
                logEvent(analyticsInstance, 'show_more_articles')
            }

            constraints.push(limit(15))
            let q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'), ...constraints)
            let docs = await getDocs(q)

            this.$root.$emit('query:loaded')
            this.articles = this.articles || []
            
            docs.forEach(doc => {
                let buffer = doc.data()
                buffer.id = doc.id
                this.articles.push(buffer)
            })
            this.lastVisible = this.articles[this.articles.length - 1]
        }
    },
    async mounted() {
        this.fetch()
        this.categories = await getCategories()
    }
}
</script>