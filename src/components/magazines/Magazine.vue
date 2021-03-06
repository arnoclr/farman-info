<template>
    <div>
        <div class="content">
            <router-link to="/" class="icon-button"><i class="material-icons">arrow_back</i></router-link>

            <div id="landing" v-if="magazine">
                <h1>{{ magazine.title }}</h1>
                <p>{{ magazine.summary }}</p>
                <button @click="startReading" id="start-reading">start reading</button>
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
.content {
    padding: 16px;
}
</style>

<script>
const {magazines} = require('../../firebaseConfig.js')
let magazine = {}

export default {
    components: {
        AppFooter: () => import('../Footer.vue'),
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
        }
    }
}
</script>