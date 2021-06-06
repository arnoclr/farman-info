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
                        <router-link :to="'/article/' + article.id + '?ref=feed'"
                            class="fm-card fm-card--img fm-card--full-width"
                            :disabled="!article.published">
                            <div class="fm-card__img fm-card__img--left fm-card__img--limited-height">
                                <img :src="article.thumbnail" :alt="article.title">
                            </div>
                            <div class="fm-card__body fm-card__body--responsive fm-card__body--date">
                                <router-link :to="'/articles/category/' + article.category + '?ref=articles_feed'"
                                    class="fm-card__body-category" v-if="categories">
                                    {{ categories.find(o => o.id == article.category) ? categories.find(o => o.id == article.category).label : '' }}
                                </router-link>
                                <h1 class="fm-card__body-title">{{ article.title }}</h1>
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
import {db, auth} from '../../firebaseConfig'
import {getCategories} from '../../assets/js/firestore/getCategories'
import {articleCardMixin} from '../../mixins/articlesCard'

export default {
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        CategoryLabel: () => import('../utils/CategoryLabel')
    },
    mixins: [articleCardMixin],
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
        fetch() {
            let category = this.$route.params.category
            let author = this.$route.params.author
            this.$root.$emit('query:loading')
            
            let query = db.collection('articles').orderBy('createdAt', 'desc')
            if(auth.currentUser && author && auth.currentUser.uid == author) {
                document.title = 'Mes articles'
            } else {
                query = query.where('published', '==', true)
            }
            query = category ? query.where('category', '==', category) : query
            query = author ? query.where('uid', '==', author) : query
            query = this.lastVisible ? query.startAfter(this.lastVisible.createdAt) : query
            query = query.limit(15)
            
            query.get().then(docs => {
                this.$root.$emit('query:loaded')
                this.articles = this.articles ? this.articles : []
                docs.forEach(doc => {
                    let buffer = doc.data()
                    buffer.id = doc.id
                    this.articles.push(buffer)
                })
                this.lastVisible = this.articles[this.articles.length - 1]
            })
            .catch(err => {
                this.$root.$emit('toast', err)
                console.log(err)
            })
        }
    },
    mounted() {
        this.fetch()
        this.categories = getCategories()
    }
}
</script>