<template>
    <div>
        <app-header></app-header>

        <div class="divided">
            <main>
                <div v-if="article">
                    <span v-if="!article.published">En cours de traitement ...</span>
                    <router-link v-if="user && article.uid == user.uid" :to="'/article/' + $route.params.ref + '/edit'">modifier (vous êtes le seul a voir ce message)</router-link>
                    
                    <span t>
                        {{ new Date(article.createdAt.seconds*1000).toLocaleDateString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
                        à {{ new Date(article.createdAt.seconds*1000).toISOString().substr(11, 5) }}
                    </span>
                    <h1>{{ article.title }}</h1>
                    <vue-simple-markdown :source="article.content"></vue-simple-markdown>

                    <p p>Partager l'article <md-icon>arrow_forward</md-icon></p>
                    <div sl>
                        <a :href="'https://www.facebook.com/sharer/sharer.php?s=100&p[url]=https://farman.info' + $route.path"
                            title="Partager sur Facebook" target="_blank">
                            <img src="/assets/icons/Farman_Facebook.png" alt="facebook icon" height="24">
                        </a>
                        <a :href="'https://twitter.com/intent/tweet?url=https://farman.info' + $route.path" 
                            title="Tweeter" target="_blank">
                            <img src="/assets/icons/Farman_Twitter.png" alt="twitter icon" height="24">
                        </a>
                    </div>
                </div>
            </main>

            <app-sidebar></app-sidebar>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<style lang="scss" scoped>
main {
    [t] {
        color: #999;
        font-weight: 500;
        font-size: 16px;
    }

    [p] {
        color: #333;
        font-size: 24px;
        font-weight: 500;
        letter-spacing: -1.5px;

        i {
            color: teal !important;
        }
    }

    [sl] {
        img {
            height: 24px;
            width: 24px;
            margin-right: 8px;
        }
    }
}
</style>

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
            article: null,
            related: null,
            user: this.$root.user
        }
    },
    methods: {
        fetch() {
            const ref = this.$route.params.ref
            this.$root.$emit('query:loading')
            db.collection('articles').doc(ref).get()
            .then(doc => {
                this.$root.$emit('query:loaded')
                this.article = doc.data()
                this.fetchRelated()
            })
            .catch(err => {
                alert(err)
            })
        },
        fetchRelated() {
            db.collection('articles')
            .orderBy('createdAt', 'desc')
            .where('tags', 'array-contains-any', this.article.tags)
            .startAfter(this.article.createdAt)
            .limit(5)
            .get().then(docs => {
                docs.forEach(doc => {
                    console.log(doc.data())
                })
            })
            .catch(e => {
                this.$root.$emit('alert', e)
            })
        }
    },
    mounted() {
        this.fetch()
    }
}
</script>