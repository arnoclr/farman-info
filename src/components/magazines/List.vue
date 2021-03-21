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

                <div class="list" v-if="magazines">
                    <div v-for="(item, index) in magazines" v-bind:key="index">
                        <div class="magazine-last" v-if="index === 0">
                            <h2>Dernier numéro</h2>
                            <router-link :to="'/magazine/' + item.id + '?ref=thumb'">
                                <img :src="item.image" alt="">
                            </router-link>
                            <h3>{{ item.title }}</h3>
                            <p v-if="item.summary">{{ item.summary }}</p>
                            <div class="info" v-else>
                                <p>Description non disponible.</p>
                            </div>
                            <router-link :to="'/magazine/' + item.id + '?ref=cta'" class="button-outlined">Lire</router-link>
                            <a class="button-outlined" target="_blank" :href="'https://api.whatsapp.com/send?text=https://farman.info/magazines?utm_source=share'">Partager <i class="material-icons">ios_share</i></a>
                        </div>
                        <div class="magazine-box" v-else>
                            <router-link :to="'/magazine/' + item.id + '?ref=cta'">
                                <img :src="item.image" alt="">
                            </router-link>
                            <h3>{{ item.title }}</h3>
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
            </main>

            <app-sidebar></app-sidebar>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<style scoped>
[a] {
    display: flex;
}

.box span {
    color: #999;
}

.magazine-box {
    width: 50%;
}

img {
    width: 100%;
    aspect-ratio: 1/1.414;
    object-fit: cover;
    max-width: 240px;
}

.magazine-last img {
    width: 50%;
    display: block;
}

a {
    height: 42px;
    vertical-align: bottom;
}
</style>

<script>
const {magazines} = require('../../firebaseConfig.js')

export default {
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue'),
        AppSidebar: () => import('../utils/Sidebar.vue')
    },
    data() {
        return {
            magazines: null,
            loading: null,
            error: null
        }
    },
    created() {
        this.getMagazines()
    },
    methods: {
        getMagazines() {
            this.magazines = this.error = null
            this.loading = true
            magazines.orderBy('date', 'desc').limit(5).get()
            .then(snapshot => {
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
                this.error = err
            })
        },
    }
}
</script>