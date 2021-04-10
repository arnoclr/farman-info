<template>
    <div>
        <app-header></app-header>

        <main class="content">
            <a @click="back" title="page précédente" class="icon-button fab"><i class="material-icons">arrow_back</i></a>

            <div class="error" v-if="error">
                <p>Une erreur est survenue : <ins>{{ error }}</ins></p>
            </div>

            <template id="landing" v-if="magazine && !error">
                <img :src="magazine.image" alt="">
                <h1>{{ magazine.title }}</h1>
                <p v-if="magazine.summary">{{ magazine.summary }}</p>
                <div class="info" v-else>
                    <p>Description non disponible.</p>
                </div>

                <router-link 
                    :to="{ name: 'PdfViewer', params: { ref: magazine.ref } }"
                    class="button" id="start-reading"
                    :disabled="offline && !stored">
                    {{ continueReading ? 'Continuer a lire' : 'Ouvrir le lecteur' }}    
                </router-link>

                <md-button @click="deletePdfFromStorage" class="md-icon-button" v-if="stored">
                    <md-icon>delete</md-icon>
                </md-button>
                <md-button @click="downloadPdf" class="md-icon-button" v-if="!stored && !downloadPdfProgress">
                    <md-icon>download</md-icon>
                </md-button>
                <md-progress-spinner :md-diameter="30" :md-stroke="3" :md-value="downloadPdfProgress" md-mode="determinate" v-if="downloadPdfProgress"></md-progress-spinner>

                <br><small v-if="fileSize">{{ fileSize }}</small>
                <small v-if="stored" os>Disponible hors-ligne <md-icon oi>done</md-icon></small>
            </template>
            <div class="center" style="height: 80vh" v-else>
                <svg class="loader" width="60" height="60" xmlns="http://www.w3.org/2000/svg" >
                    <g>
                        <ellipse ry="25" rx="25" cy="30" cx="30" stroke-width="5" stroke="teal" fill="none"/>
                    </g>
                </svg>
            </div>
        </main>

        <app-footer></app-footer>
    </div>
</template>

<style scoped>
.content {
    position: relative;
}

.icon-button {
    position: fixed;
    top: 86px;
    left: 16px;
}

img {
    width: 50%;
    max-width: 240px;
    aspect-ratio: 1/1.414;
    object-fit: cover;
    display: block;
}

.button, .button-outlined {
    vertical-align: bottom;
    height: 40px;
}

[os] {
    margin-left: 8px;
}
[oi] {
    font-size: small !important;
}
</style>

<script>
import {magazines, storage, analytics} from '../../firebaseConfig.js'
import browserFileStorage from 'browser-file-storage'
import FileConvertSize from '../../assets/js/fileConvertSize'

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
            stored: false,
            downloadPdfProgress: false,
            fileSize: null,
            continueReading: false,
            offline: !navigator.onLine
        }
    },
    created() {
        this.getMagazine()
        const storageKey = this.$route.params.ref + '-progress'
        const lastProgress = localStorage.getItem(storageKey)
        this.continueReading = (lastProgress && lastProgress > 1) ? true : false
        if(!browserFileStorage._init) {
            browserFileStorage.init('farman').then(status => {})
            .catch(error => {
                console.log(error)
                this.$root.$emit('toast', "Erreur lors de l'initialisation du stockage")
            })
        }
    },
    methods: {
        getMagazine() {
            this.magazine = this.error = null
            this.loading = true
            this.$root.$emit('query:loading')
            const ref = this.$route.params.ref
            magazines.doc(ref).get().then(snapshot => {
                if (this.$route.params.ref !== ref) return
                this.loading = false
                this.$root.$emit('query:loaded')
                if(snapshot.data()) {
                    this.magazine = snapshot.data()
                    this.magazine.ref = ref
                    document.title = this.magazine.title
                    this.error = false
                    this.checkIfPdfIsStored()
                    this.getFileSize()
                } else {
                    this.error = 'Aucun résultat correspondant'
                }
            }).catch(err => {
                this.error = err
            })
        },
        downloadPdf() {
            var xhr = new XMLHttpRequest()
            xhr.responseType = 'blob'
            xhr.onload = (event) => {
                this.savePdfIntoStorage(xhr.response)
                this.downloadPdfProgress = false
            }
            xhr.onprogress = evt => {
                if (evt.lengthComputable) {
                    this.downloadPdfProgress = (evt.loaded / evt.total) * 100
                } 
            }
            xhr.onerror = (err) => {
                this.$root.$emit('toast', 'Impossible de télécharger le document')
            }
            xhr.open('GET', this.magazine.url)
            xhr.send();
        },
        savePdfIntoStorage(blob) {
            browserFileStorage.save(this.magazine.ref, blob).then(file => {
                analytics.logEvent('pdf_downloaded')
                this.$root.$emit('toast', this.magazine.title + ' télechargé avec succès')
                this.checkIfPdfIsStored()
            }).catch(error => {
                console.error('Could not save the image!', file)
            })
        },
        deletePdfFromStorage() {
            browserFileStorage.delete(this.magazine.ref).then(() => {
                this.$root.$emit('toast', this.magazine.title + ' supprimé')
                this.checkIfPdfIsStored()
            }).catch((error) => {
                console.error(error)
            })
        },
        checkIfPdfIsStored() {
            browserFileStorage.load(this.magazine.ref).then((file) => {
                this.stored = true
            }).catch((error) => {
                this.stored = false
                console.error(error)
            })
        },
        getFileSize() {
            storage.ref('magazines').child(this.magazine.ref + '.pdf').getMetadata().then(meta => {
                this.fileSize = FileConvertSize(meta.size)
            })
        },
        back() {
            this.$router.push('/magazines?ref=back_button')
        }
    }
}
</script>