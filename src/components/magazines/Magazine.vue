<template>
    <div>
        <app-header></app-header>

        <div class="content">
            <a @click="back" class="icon-button"><i class="material-icons">arrow_back</i></a>

            <template id="landing" v-if="magazine">
                <img :src="magazine.image" alt="">
                <h1>{{ magazine.title }}</h1>
                <p>{{ magazine.summary }}</p>
                <router-link :to="{ name: 'PdfViewer', params: { ref: magazine.ref } }" class="button" id="start-reading">Ouvrir le lecteur</router-link>
                <a class="button-outlined" :href="magazine.url">Télécharger le pdf</a>
            </template>
            <div class="center" style="height: 80vh" v-else>
                <svg class="loader" width="60" height="60" xmlns="http://www.w3.org/2000/svg" >
                    <g>
                        <ellipse ry="25" rx="25" cy="30" cx="30" stroke-width="5" stroke="teal" fill="none"/>
                    </g>
                </svg>
            </div>

            <div class="error" v-if="error">
                <h1>Une erreur s'est produite</h1>
            </div>
        </div>

        <div class="fullscreen-viewer">
            <pdf-viewer v-if="viewer"></pdf-viewer>
        </div>
        <app-footer></app-footer>
    </div>
</template>

<style scoped>
a {
    cursor: pointer;
}

.content {
    padding: 16px;
}

img {
    width: 50%;
    max-width: 240px;
    aspect-ratio: 1/1.414;
    object-fit: cover;
    display: block;
}
</style>

<script>
const {magazines} = require('../../firebaseConfig.js')
let magazine = {}

export default {
    components: {
        AppFooter: () => import('../Footer.vue'),
        AppHeader: () => import('../Navigation.vue')
    },
    data() {
        return {
            loading: false,
            magazine: null,
            error: null,
            viewer: false,
        }
    },
    created() {
        this.getMagazine()
    },
    methods: {
        getMagazine() {
            this.magazine = this.error = null
            this.loading = true
            const ref = this.$route.params.ref
            magazines.doc(ref).get().then(snapshot => {
                if (this.$route.params.ref !== ref) return
                this.loading = false
                if(snapshot.data()) {
                    this.magazine = snapshot.data()
                    this.magazine.ref = ref
                } else {
                    this.error = true
                }
            })
        },
        back() {
            this.$router.go(-1)
        }
    }
}
</script>