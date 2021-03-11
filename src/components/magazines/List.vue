<template>
    <div>
        <app-header></app-header>

        <div class="box">
            <h1>Farman Magazine</h1>
            <p>Votre rendez-vous lifestyle culture et voyage bimestriel par Farman disponible gratuitement en 100% numérique depuis notre site internet.</p>
        </div>

        <div class="list" v-if="magazines">
            <div v-for="(item, index) in magazines" v-bind:key="index">
                <div class="magazine-last" v-if="index === 0">
                    <h2>Dernier numéro</h2>
                    <img :src="item.image" alt="">
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.summary }}</p>
                    <router-link :to="{ name: 'Magazine', params: { ref: item.id } }" class="button-outlined">Lire</router-link>
                </div>
                <div class="magazine-box" v-else>
                    <router-link :to="{ name: 'Magazine', params: { ref: item.id } }">
                        <img :src="item.image" alt="">
                    </router-link>
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.summary }}</p>
                </div>
            </div>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<style scoped>
.box {
    padding: 16px;
}

.magazine-last {
    margin: 16px;
}

.magazine-box {
    width: 50%;
    margin: 16px;
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
</style>

<script>
const {magazines} = require('../../firebaseConfig.js')

export default {
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue')
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