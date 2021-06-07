<template>
    <div>
        <app-header></app-header>

        <div class="divided">
            <main>
                <div class="box">
                    <span>Magazine</span>
                    <h1>Farman Magazine</h1>
                    <p>Votre rendez-vous lifestyle culture et voyage bimestriel par Farman disponible gratuitement en 100% numérique depuis notre site internet.</p>
                </div>

                <single-magazine :open.sync="magazineDialogOpen"></single-magazine>

                <div class="list" v-if="magazines">
                    <div v-for="(item, index) in magazines" v-bind:key="index" :class="index != 0 ? 'grid' : ''">
                        <div class="magazine-last" v-if="index === 0">
                            <h2>Dernier numéro
                                <md-button @click="requestNotifications" class="md-icon-button" v-if="!notificationsEnabled" b>
                                    <md-icon>notification_add</md-icon>
                                    <md-tooltip md-direction="bottom">Activer les notifications</md-tooltip>
                                </md-button>
                            </h2>
                            <img :src="item.image" @click="openMagazine(item.id, 'thumb')" alt="">
                            <h2>{{ item.title }}</h2>
                            <p v-if="item.summary">{{ item.summary }}</p>
                            <div class="info" v-else>
                                <p>Description non disponible.</p>
                            </div>
                            <div class="fm-section">
                                <a class="fm-button fm-button--large fm-button--full fm-button--outlined" target="_blank" :href="'https://api.whatsapp.com/send?text=https://farman.info/magazines?utm_source=share'">
                                    Partager <i class="material-icons fm-button__icon fm-button__icon--right">{{ $device.ios ? 'ios_share' : 'share' }}
                                </i></a>
                                <button class="fm-button fm-button--large fm-button--full" @click="openMagazine(item.id, 'cta')">
                                    Lire <i class="material-icons fm-button__icon fm-button__icon--right">launch</i>
                                </button>
                            </div>
                        </div>
                        <div class="magazine-box" v-else>
                            <img :src="item.image" @click="openMagazine(item.id, 'thumb')" alt="">
                            <h2>{{ item.title }}</h2>
                            <p v-if="item.summary">{{ item.summary }}</p>
                            <div class="info" v-else>
                                <p>Description non disponible.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="center" style="height: 80vh" v-else>
                    <svg class="loader" width="60" height="60" xmlns="http://www.w3.org/2000/svg" >
                        <g>
                            <ellipse ry="25" rx="25" cy="30" cx="30" stroke-width="5" stroke="teal" fill="none"/>
                        </g>
                    </svg>
                </div>

                <md-empty-state
                    v-if="magazines.length == 0"
                    md-icon="upcoming"
                    md-label="Patientez ..."
                    md-description="Aucun magazine n'a encore été publié.">
                </md-empty-state>
            </main>

            <app-sidebar></app-sidebar>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<style lang="scss" scoped>
.box span {
    color: #999;
}

.list {
    img {
        width: 100%;
        aspect-ratio: 1/1.414;
        object-fit: cover;
        max-width: 240px;
        border: 1px solid grey;
    }

    .magazine-last {
        [b] {
            margin-top: -8px;
            z-index: 0;
        }

        img {
            width: 50%;
            display: block;
        }

        a {
            height: 42px;
            vertical-align: bottom;
        }
    }

    .grid {
        width: 50%;
        margin-top: 16px;
        display: inline-block;
        vertical-align: text-top;

        @media screen and(max-width: 600px) {
            width: 100%;
        }
    }
}
</style>

<script>
const {magazines} = require('../../firebaseConfig.js')
import { notifcationsMixin, notificationsMixin } from '../../mixins/notifications';

export default {
    mixins: [notificationsMixin],
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        AppSidebar: () => import('../utils/Sidebar.vue'),
        SingleMagazine: () => import('./Magazine.vue')
    },
    data() {
        return {
            magazines: null,
            loading: null,
            error: null,
            magazineDialogOpen: false
        }
    },
    metaInfo() {
        return {
            title: 'Farman - Les derniers magazines',
            link: [
                { rel: 'canonical', href: this.$root.hostname + '/magazines' }
            ]
        }
    },
    watch: {
        "magazineDialogOpen": function(val, old) {
            if(val === false) {
                window.history.replaceState('', document.title, '/magazines')
            }
        }
    },
    methods: {
        openMagazine(id, ref) {
            this.magazineDialogOpen = true
            if(this.$route.params.id === id) return
            this.$router.push({name: 'Magazine', params: {id, ref}})
        },
        getMagazines() {
            this.$root.$emit('query:loading')
            this.magazines = this.error = null
            this.loading = true
            magazines.orderBy('date', 'desc').limit(15).get()
            .then(snapshot => {
                this.$root.$emit('query:loaded')
                this.loading = false
                this.magazines = []
                snapshot.forEach(doc => {
                    let buffer = doc.data()
                    buffer.id = doc.id
                    this.magazines.push(buffer)
                })
            })
            .catch(err => {
                console.log(err)
                this.$root.$emit('toast', err)
            })
        }
    },
    mounted() {
        this.getMagazines()
        if(this.$route.params.id)
            this.magazineDialogOpen = true
    }
}
</script>