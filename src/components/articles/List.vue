<template>
    <div>
        <app-header></app-header>

        <div class="divided">
            <main>
                <div v-if="articles">
                    <article v-for="(article, index) in articles" v-bind:key="index">
                        <router-link :to="'/article/' + article.id + '?ref=feed'">
                            <img :src="getImageFromContent(article.content)" :alt="article.title">
                            <div v-if="categories">
                                <category-label
                                    :category="categories.find(o => o.id == article.category)"
                                    link-ref="articles_feed">
                                </category-label>
                            </div>
                            <h1>{{ article.title }}</h1>
                        </router-link>
                    </article>
                    <md-button @click="fetch">afficher plus</md-button>
                </div>
            </main>

            <app-sidebar></app-sidebar>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<style lang="scss" scoped>

</style>

<script>
import {db, auth} from '../../firebaseConfig'
import {getCategories} from '../../assets/js/firestore/getCategories'

export default {
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        AppSidebar: () => import('../utils/Sidebar.vue'),
        CategoryLabel: () => import('../utils/CategoryLabel')
    },
    data() {
        return {
            articles: null,
            lastVisible: null,
            categories: null
        }
    },
    watch: {
        '$route.path': function(val, oldVal) {
            this.articles = this.lastVisible = null
            this.fetch()
        }
    },
    methods: {
        getImageFromContent(content) {
            const regex = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g
            let matchs = regex.exec(content)
            return matchs ? matchs[1] : null
        },
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