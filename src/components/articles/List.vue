<template>
    <div>
        <app-header></app-header>

        <div class="divided">
            <main>
                <div v-if="articles">
                    <ul>
                        <li v-for="(article, index) in articles" v-bind:key="index">
                            <router-link :to="'/article/' + article.id + '?ref=feed'">
                                <h1>{{ article.title }}</h1>
                                <img :src="getImageFromContent(article.content)" alt="">
                            </router-link>
                        </li>
                    </ul>
                    <md-button @click="fetch">afficher plus</md-button>
                </div>
            </main>

            <app-sidebar></app-sidebar>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<script>
import {db} from '../../firebaseConfig'

export default {
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        AppSidebar: () => import('../utils/Sidebar.vue')
    },
    data() {
        return {
            articles: null,
            lastVisible: null
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
            this.$root.$emit('query:loading')
            
            let query = db.collection('articles').orderBy('createdAt', 'desc').where('published', '==', true)
            query = category ? query.where('category', '==', category) : query
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
    }
}
</script>