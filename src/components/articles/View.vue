<template>
    <div>
        <app-header></app-header>

        <div class="divided">
            <main>
                <div v-if="article">
                    <span v-if="!article.published">En cours de traitement ...</span>
                    <router-link v-if="user && article.uid == user.uid" :to="'/article/' + $route.params.ref + '/edit'">modifier</router-link>
                    <h1>{{ article.title }}</h1>
                    <vue-simple-markdown :source="article.content"></vue-simple-markdown>
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
            article: null,
            user: this.$root.user
        }
    },
    methods: {
        fetch() {
            this.$root.$emit('query:loading')
            const ref = this.$route.params.ref
            db.collection('articles').doc(ref).get()
            .then(doc => {
                this.$root.$emit('query:loaded')
                this.article = doc.data()
            })
            .catch(err => {
                alert(err)
            })
        }
    },
    mounted() {
        this.fetch()
    }
}
</script>