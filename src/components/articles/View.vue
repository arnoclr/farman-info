<template>
    <div>
        <app-header></app-header>
        <horizontal-banner></horizontal-banner>
        <install-button mode="banner"></install-button>

        <div v-if="article">
            <main>
                <div>
                    <span v-if="!article.published">En cours de traitement ...</span>
                    <router-link v-if="user && article.uid == user.uid" :to="'/article/' + $route.params.id + '/edit'">modifier (vous êtes le seul a voir ce message)</router-link>
                    
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
                        <div class="fm-markdown fm-markdown--commentable" v-html="markdownRender"></div>
                    </div>

                    <div class="fm-box fm-box--centered" v-if="needLogin">
                        <i class="material-icons fm-box__icon">lock</i>
                        <h2 class="fm-box__title">Créez un compte pour lire l'article.</h2>
                        <p class="fm-box__text">Ou connectez-vous.</p>
                        <router-link :to="{name: 'Login', params: {ref: 'need_login_box'}}" class="fm-button">Me connecter</router-link>
                    </div>

                    <p p>Vous avez aimé ? <md-icon>arrow_forward</md-icon></p>
                    <bottom-share :open.sync="shareDialogOpen" :url="$root.hostname + $route.path + '?ref=share'"></bottom-share>
                    <div class="fm-section--sticky fm-section--sticky--top">
                        <div class="fm-section fm-section--scrollable fm-section--scrollable--no-gap">
                            <div class="item">
                                <button @click="shareDialogOpen = true" class="fm-button">
                                    partager <i class="material-icons fm-button__icon fm-button__icon--right">{{ $device.ios ? 'ios_share' : 'share' }}</i>
                                </button>
                            </div>
                            <div class="item">
                                <button class="fm-button fm-button--outlined" @click="openComments('button')">
                                Lire les commentaires</button>
                            </div>
                            <div class="item">
                                <a class="fm-button fm-button--outlined"
                                href="https://news.google.com/publications/CAAqBwgKMJ2KpwswhZW_Aw" 
                                target="_blank" rel="nofollow noopener" title="Google News">
                                    S'abonner sur <img height="72" width="72" src="/assets/icons/google-news.svg" alt="">
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="youtube-banner">
                        <p>Farman, le média aéro innovation, trafic et éco sur vos réseaux sociaux et farman.info.</p>
                        <div id="ytbtn" class="g-ytsubscribe" data-channelid="UC9oYwEaRK3Bv68G-bKe-l_Q" data-layout="full" data-count="default"></div>
                    </div>

                    <div 
                    class="mt-64"
                    v-observe-visibility="{
                        callback: fetchRelated,
                        throttle: 700,
                    }">
                        <!-- has suggestions -->
                        <div v-if="related && related.length > 0">
                            <h2>Suggestions</h2>
                            <articles-slider
                            :button_link="'/articles/suggestions?tags=' + article.tags + '&ref=article_view_suggestions'"
                            ga_ref="suggestions" :articles="related"></articles-slider>
                        </div>
                        <!-- no suggestions -->
                        <md-empty-state
                            v-else-if="related && related.length === 0"
                            md-icon="auto_fix_off"
                            md-label="Pas de suggestions"
                            md-description="Nous n'avons trouvé aucun autre article similaire.">
                            <router-link class="fm-button fm-button--large"
                            :to="{name: 'articleList', params: {ref: 'suggestions'}}">Voir les derniers articles</router-link>
                        </md-empty-state>
                        <!-- loading -->
                        <div v-else class="fm-section fm-section--center" style="height: 450px">
                            <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
                        </div>
                    </div>

                </div>
            </main>

            <!-- comments -->
            <div class="comments-banner fm-main-padding fm-section--sticky fm-section--sticky--bottom" 
            @click="openComments('banner')" v-if="$root.user">
                <img :src="this.$root.user.photoURL" alt="photo de profil">
                <span>Ajouter un commentaire...</span>
            </div>
            <div class="comments-banner fm-main-padding fm-section--sticky fm-section--sticky--bottom" 
            @click="openComments('banner')" v-else>
                <span>Lire les commentaires</span>
            </div>
            <comments-bottom-sheat :prefilled="commentPrefilled" :doc="doc" :open.sync="commentsOpen" :loaded="commentsDialogLoaded"></comments-bottom-sheat>
        </div>
        <div v-else style="height: 100vh"></div>

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

.youtube-banner {
    padding: 8px 16px 32px 16px;
    background: #eee;
}

.comments-banner {
    background: #eee;
    padding: 16px;

    img {
        width: 32px;
        height: 32px;
        margin-right: 16px;
        border-radius: 50%;
    }

    span {
        color: #666;
        font-size: 16px;
    }
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
        ArticlesSlider: () => import('./Slider.vue'),
        CommentsBottomSheat: () => import('./CommentsBottomSheat.vue'),
        HorizontalBanner: () => import('../utils/HorizontalBanner.vue')
    },
    data() {
        return {
            article: null,
            related: null,
            relatedLoaded: false,
            user: this.$root.user,
            needLogin: false,
            shareDialogOpen: false,
            commentsDialogLoaded: false,
            commentPrefilled: '',
            author: null,
            readTime: 0,
            interval: null,
            commentsOpen: false,
            doc: null
        }
    },
    computed: {
        markdownRender() {
            console.log(this.article.content)
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
            this.related = null,
            this.relatedLoaded = false,
            this.author = null,
            this.readTime = 0,
            this.commentsDialogLoaded = false
        }
    },
    methods: {
        appendCommentsButtons() {
            const p = document.querySelectorAll('.fm-markdown>p')
            p.forEach(p => {
                const text = p.innerText
                p.innerHTML += 
                `<button title="Commenter ce paragraphe"
                class="comment-button fm-button fm-button--fab fm-button--fab--primary">
                    <i class="material-icons">add_comment</i>
                </button>`
                const button = p.querySelector('button')
                button.addEventListener('click', () => {
                    this.openComments('inline_button', '> ' + text + '\n\n')
                })
            })
        },
        fetch() {
            const ref = this.$route.params.id
            this.$root.$emit('query:loading')
            this.doc = db.collection('articles').doc(ref)
            this.doc.get()
            .then(doc => {
                this.$root.$emit('query:loaded')
                this.article = doc.data()
                this.fetchAuthor()
                setTimeout(() => {
                    this.appendCommentsButtons()
                }, 1000);
                if(this.article.needLogin && !this.user) {
                    this.needLogin = true
                }
                analytics.logEvent('open_article', {
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
        fetchRelated(isVisible) {
            if(!isVisible) return
            if(this.relatedLoaded) return
            this.relatedLoaded = true
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
                    if(doc.id != this.article.id) {
                        this.related.push(buffer)
                    }
                })
            })
            .catch(e => {
                console.error(e)
            })
            // log event when article is readed
            if(this.readTime < 20) return
            const wordCount = this.article.content.match(/(\w+)/g).length;
            analytics.logEvent('read_article', {
                value: wordCount / this.readTime, // words/s
                ref: window.ref,
                article_author: this.article.uid,
                article_length: this.article.content.length,
                article_words: wordCount,
                article_tags: this.article.tags,
                read_time: this.readTime // seconds
            })
        },
        fetchAuthor() {
            db.collection('users').doc(this.article.uid).get().then(doc => {
                this.author = doc.data()
            })
        },
        timer() {
            this.readTime++
        },
        openComments(ref, text = '') {
            analytics.logEvent('open_comments', {
                ref: ref
            })
            localStorage.setItem('login-from-url', this.$route.fullPath)
            this.commentPrefilled = text
            this.commentsOpen = true
            this.commentsDialogLoaded = true
        }
    },
    mounted() {
        this.fetch()
        this.interval = setInterval(this.timer, 1000)
        this.$loadScript('https://apis.google.com/js/platform.js').then(() => {
            setTimeout(() => {
                window.gapi.ytsubscribe.go('#ytbtn')
            }, 1000);
        })
    },
    beforeDestroy() {
        clearInterval(this.interval)
    }
}
</script>