<template>
    <div>
        <app-header></app-header>

        <div>
            <main>
                <div v-if="article">
                    <span v-if="!article.published">En cours de traitement ...</span>
                    <router-link v-if="user && article.uid == user.uid" :to="'/article/' + $route.params.ref + '/edit'">modifier (vous êtes le seul a voir ce message)</router-link>
                    
                    <span t>
                        {{ new Date(article.createdAt.seconds*1000).toLocaleDateString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
                        à {{ new Date(article.createdAt.seconds*1000).toISOString().substr(11, 5) }}
                    </span>
                    <h1>
                        <md-icon class="lock" v-if="needLogin">
                            lock<md-tooltip md-direction="top">Disponible après connexion</md-tooltip>
                        </md-icon>
                        {{ article.title }}
                    </h1>

                    <div id="markdown-wrapper" :class="needLogin ? 'restricted' : ''">
                        <div class="shade"></div>
                        <vue-simple-markdown :source="article.content" :postrender="rendered()"></vue-simple-markdown>
                    </div>

                    <div class="fm-box fm-box--centered" v-if="needLogin">
                        <i class="material-icons fm-box__icon">lock</i>
                        <h2 class="fm-box__title">Créez un compte pour lire l'article.</h2>
                        <p class="fm-box__text">Ou connectez-vous.</p>
                        <router-link to="/login?ref=read_article_need_login_box" class="fm-button">Me connecter</router-link>
                    </div>

                    <p p>Partager l'article <md-icon>arrow_forward</md-icon></p>
                    <div class="mb-64" sl>
                        <a :href="'https://www.facebook.com/sharer/sharer.php?s=100&p[url]=https://farman.info' + $route.path"
                            title="Partager sur Facebook" target="_blank">
                            <img src="/assets/icons/Farman_Facebook.png" alt="facebook icon" height="24">
                        </a>
                        <a :href="'https://twitter.com/intent/tweet?url=https://farman.info' + $route.path" 
                            title="Tweeter" target="_blank">
                            <img src="/assets/icons/Farman_Twitter.png" alt="twitter icon" height="24">
                        </a>
                    </div>

                    <div  v-if="related && related.length > 0">
                        <h2>Suggestions</h2>
                        <div class="fm-section fm-section--scrollable">
                            <router-link 
                                class="item" style="text-decoration: none"
                                :to="'/article/' + article.id + '?ref=article_view_suggestions'"
                                v-for="(article, index) in related" :key="index">
                                <div class="fm-card fm-card--img fm-card--medium">
                                    <div class="fm-card__img">
                                        <img :src="getImageFromContent(article.content)" :alt="article.title">
                                    </div>
                                    <div class="fm-card__body">
                                        <h1 class="fm-card__body-title">Revivez en direct le décollage de Thomas Pesquet à bord de SpaceX.</h1>
                                        <div class="fm-card__body-content">
                                            <p>{{ removeMdFromContent(article.content).substring(0, 150) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </router-link>
                            <div class="item">
                                <router-link
                                    :to="'/articles/suggestions?tags=' + article.tags"
                                    class="fm-button fm-button--outlined fm-button--square fm-button--grey">
                                    <i class="material-icons">arrow_forward</i>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<style lang="scss" scoped>
main {
    i.lock {
        margin-right: 16px;
        color: teal !important;
        font-size: inherit !important;
    }

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

    .restricted {
        position: relative;
        overflow: hidden;
        max-height: 650px !important;
        
        .shade {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            box-shadow: inset 0 -650px 650px -450px #fff;
        }
    }
}
</style>

<script>
import {db} from '../../firebaseConfig'
import {articleCardMixin} from '../../mixins/articlesCard'

export default {
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue')
    },
    mixins: [articleCardMixin],
    data() {
        return {
            article: null,
            related: null,
            user: this.$root.user,
            needLogin: false
        }
    },
    watch: {
        '$route.path': function(val, oldVal) {
            window.scrollTo({top: 0, behavior: 'smooth'})
            this.fetch()
        }
    },
    methods: {
        rendered() {
            setTimeout(() => {
                document.querySelectorAll('.markdown-body img').forEach(img => {
                    img.classList.add('lightbox')
                    img.addEventListener('click', () => {
                        img.classList.toggle('open')
                    })
                })
            }, 250);
        },
        fetch() {
            const ref = this.$route.params.ref
            this.$root.$emit('query:loading')
            db.collection('articles').doc(ref).get()
            .then(doc => {
                this.$root.$emit('query:loaded')
                this.article = doc.data()
                this.fetchRelated()
                if(this.article.needLogin && !this.user) {
                    this.needLogin = true
                }
            })
            .catch(err => {
                console.error(err)
            })
        },
        fetchRelated() {
            db.collection('articles')
            .orderBy('createdAt', 'desc')
            .where('published', '==', true)
            .where('tags', 'array-contains-any', this.article.tags)
            .startAfter(this.article.createdAt)
            .limit(5)
            .get().then(docs => {
                this.related = []
                docs.forEach(doc => {
                    let buffer = doc.data()
                    buffer.id = doc.id
                    this.related.push(buffer)
                })
            })
            .catch(e => {
                console.error(e)
            })
        }
    },
    mounted() {
        this.fetch()
    }
}
</script>