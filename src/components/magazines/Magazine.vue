<template>
    <div>
        <app-header></app-header>

        <div class="content">
            <a @click="back" class="icon-button"><i class="material-icons">arrow_back</i></a>

            <div id="landing" v-if="magazine">
                <img :src="magazine.image" alt="">
                <h1>{{ magazine.title }}</h1>
                <p>{{ magazine.summary }}</p>
                <button @click="startReading" id="start-reading" disabled>Ouvrir le lecteur</button>
                <a class="btn" :href="magazine.url">Télécharger le pdf</a>
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
        AppHeader: () => import('../Navigation.vue'),
        PdfViewer: () => import('../magazines/PdfViewer.vue')
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
                } else {
                    this.error = true
                }
            })
        },
        startReading() {
            this.viewer = true
            document.querySelector('.fullscreen-viewer').requestFullscreen()
        },
        back() {
            this.$router.go(-1)
        }
    }
}
</script>