<template>
    <div>
        <app-header></app-header>
        <install-button mode="banner"></install-button>

        <div v-if="article">
            <main>
                <div>
                    <span v-if="!article.published">En cours de traitement ...</span>
                    <router-link v-if="user && article.uid == user.uid" :to="'/article/' + $route.params.ref + '/edit'">modifier (vous êtes le seul a voir ce message)</router-link>
                    
                    <span t>
                        {{ new Date(article.createdAt.seconds*1000).toLocaleDateString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
                        à {{ new Date(article.createdAt.seconds*1000).toISOString().substr(11, 5) }},
                        <span v-if="author">publié par <router-link :to="'/articles/author/' + article.uid">{{ author.displayName }}</router-link></span>
                    </span>
                    <h1>
                        <md-icon class="lock" v-if="needLogin">
                            lock<md-tooltip md-direction="top">Disponible après connexion</md-tooltip>
                        </md-icon>
                        {{ article.title }}
                    </h1>

                    <p class="summary">{{ article.summary }}</p>
                    <img :src="article.thumbnail" :alt="article.tags" class="banner">

                    <div id="markdown-wrapper" :class="needLogin ? 'restricted' : ''">
                        <div class="shade"></div>
                        <div class="fm-markdown" v-html="markdownRender"></div>
                    </div>

                    <div class="fm-box fm-box--centered" v-if="needLogin">
                        <i class="material-icons fm-box__icon">lock</i>
                        <h2 class="fm-box__title">Créez un compte pour lire l'article.</h2>
                        <p class="fm-box__text">Ou connectez-vous.</p>
                        <router-link :to="{name: 'Login', params: {ref: 'need_login_box'}}" class="fm-button">Me connecter</router-link>
                    </div>

                    <div class="mb-64" sl>
                        <p p>Partager l'article <md-icon>arrow_forward</md-icon></p>
                        <bottom-share :open.sync="shareDialogOpen" :url="$root.hostname + $route.path + '?ref=share'"></bottom-share>
                        <button @click="shareDialogOpen = true" class="fm-button">partager <i class="material-icons fm-button__icon fm-button__icon--right">{{ $device.ios ? 'ios_share' : 'share' }}</i></button>
                    </div>

                    <div v-if="related && related.length > 0">
                        <h2>Suggestions</h2>
                        <articles-slider
                        :button_link="'/articles/suggestions?tags=' + article.tags + '&ref=article_view_suggestions'"
                        ga_ref="suggestions" :articles="related"></articles-slider>
                    </div>
                </div>
            </main>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<style lang="scss" scoped>
.banner {
    width: 100%;
    height: auto;
}

.summary {
    font-size: 22px;
    line-height: 26px;
}

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
import {db, analytics} from '../../firebaseConfig'
import {parseMd} from '../../assets/js/utils/mdParse'

export default {
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        BottomShare: () => import('../utils/bottomShare.vue'),
        InstallButton: () => import('../utils/installButton.vue'),
        ArticlesSlider: () => import('./Slider.vue')
    },
    data() {
        return {
            article: null,
            related: null,
            user: this.$root.user,
            needLogin: false,
            shareDialogOpen: false,
            author: null,
        }
    },
    computed: {
        markdownRender() {
            return parseMd(this.article.content)
        }
    },
    metaInfo() {
        return {
            title: this.article ? this.article.title + ' - Farman' : 'Chargement ...',
            link: [
                { rel: 'canonical', href: this.$root.hostname + this.$route.path }
            ],
            meta: [
                { name: 'keywords', content: this.article ? this.article.tags : '' },
                { name: 'description', vmid: 'description', content: this.article ? this.article.summary.substring(0, 160) : '' }
            ]
        }
    },
    watch: {
        '$route.path': function(val, oldVal) {
            this.fetch()
        }
    },
    methods: {
        /*rendered() {
            setTimeout(() => {
                document.querySelectorAll('.markdown-body img').forEach(img => {
                    img.classList.add('lightbox')
                    img.addEventListener('click', () => {
                        img.classList.toggle('open')
                    })
                })
            }, 250);
        },*/
        fetch() {
            const ref = this.$route.params.id
            this.$root.$emit('query:loading')
            db.collection('articles').doc(ref).get()
            .then(doc => {
                this.$root.$emit('query:loaded')
                this.article = doc.data()
                this.fetchRelated()
                this.fetchAuthor()
                if(this.article.needLogin && !this.user) {
                    this.needLogin = true
                }
                analytics.logEvent('read_article', {
                    ref: window.ref,
                    article_author: this.article.uid,
                    article_length: this.article.content.length,
                    article_tags: this.article.tags
                })
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
        },
        fetchAuthor() {
            db.collection('users').doc(this.article.uid).get().then(doc => {
                this.author = doc.data()
            })
        }
    },
    mounted() {
        this.fetch()
    }
}
</script>