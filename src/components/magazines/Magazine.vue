<template>
    <div>
        <div
        v-touch:start="startSwipe"
        v-touch:moving="swipe"
        v-touch:end="endSwipe"
        ref="swipableDialog"
        :class="'fm-bottom-sheat ' + (open ? 'fm-bottom-sheat--open' : '')">
            <div class="fm-bottom-sheat__pill">
                <div></div>
            </div>
            <div class="fm-bottom-sheat__body">
                <div class="fm-bottom-sheat__body-grid">
                    <div class="error" v-if="error">
                        <p>Une erreur est survenue : <ins>{{ error }}</ins></p>
                    </div>

                    <template id="landing" v-if="magazine && !error">
                        <div class="fm-section fm-section--mag">
                            <img class="fm-section__img" :src="magazine.image" alt="">
                            <div class="fm-section__desc">
                                <h1>{{ magazine.title }}</h1>
                                <p v-if="magazine.summary">{{ magazine.summary }}</p>
                                <div class="info" v-else>
                                    <p>Description non disponible.</p>
                                </div>
                            </div>
                        </div>

                        <div class="fm-section fm-section--bottom fm-section--shade p-16">
                            <!-- downloaded pdf -->
                            <div class="fm-section" v-if="stored">
                                <button @click="deletePdfFromStorage"
                                class="fm-button fm-button--large fm-button--full fm-button--outlined">
                                    Supprimer
                                    <md-icon class="fm-button__icon fm-button__icon--right">delete</md-icon>
                                </button>
                                <router-link 
                                    :to="{ name: 'PdfViewer', params: { ref: magazine.ref } }"
                                    class="fm-button fm-button--large fm-button--full" id="start-reading"
                                    :disabled="offline && !stored">
                                    {{ continueReading ? 'Continuer a lire' : 'Lire' }}
                                </router-link>
                            </div>

                            <!-- download button -->
                            <div class="fm-section" v-else-if="canDownload">
                                <button @click="downloadPdf" :disabled="downloadPdfProgress"
                                class="fm-button fm-button--large fm-button--full">
                                    <md-progress-spinner :md-diameter="30" :md-stroke="3" :md-value="downloadPdfProgress" md-mode="determinate" v-if="downloadPdfProgress"></md-progress-spinner>
                                    <span v-else>Télécharger  • {{ fileSize }}</span>
                                </button>
                            </div>

                            <!-- default read button -->
                            <div class="fm-section" v-else>
                                <router-link 
                                    :to="{ name: 'PdfViewer', params: { ref: magazine.ref } }"
                                    class="fm-button fm-button--large fm-button--full" id="start-reading"
                                    :disabled="offline && !stored">
                                    {{ continueReading ? 'Continuer a lire' : 'Lire • ' + fileSize }}    
                                </router-link>
                            </div>
                            <small v-if="stored" os>Disponible hors-ligne <md-icon oi>done</md-icon></small>
                        </div>

                        <br><small v-if="fileSize">{{ fileSize }}</small>
                        
                    </template>

                    <div class="center" style="height: 80vh" v-if="!magazine && !error">
                        <svg class="loader" width="60" height="60" xmlns="http://www.w3.org/2000/svg" >
                            <g>
                                <ellipse ry="25" rx="25" cy="30" cx="30" stroke-width="5" stroke="teal" fill="none"/>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="fm-backdrop" @click="closeModal"></div>
    </div>
</template>

<script>
import {magazines, storage, analytics} from '../../firebaseConfig.js'
import browserFileStorage from 'browser-file-storage'
import FileConvertSize from '../../assets/js/fileConvertSize'
import {bottomSheatMixin} from '../../mixins/bottomSheat'

export default {
    mixins: [bottomSheatMixin],
    data() {
        return {
            loading: false,
            magazine: null,
            error: null,
            viewer: false,
            stored: false,
            downloadPdfProgress: false,
            fileSize: '...',
            continueReading: false,
            offline: !navigator.onLine,
            canDownload: false
        }
    },
    created() {
        this.getMagazine()
        this.initStorage()
    },
    watch: {
        '$route.path': function(val, oldVal) {
            this.getMagazine()
            this.initStorage()
        }
    },
    methods: {
        getMagazine() {
            this.magazine = this.error = null
            this.loading = true
            const ref = this.$route.params.id
            magazines.doc(ref).get().then(snapshot => {
                if (this.$route.params.id !== ref) return
                this.loading = false
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
        initStorage() {
            const storageKey = this.$route.params.id + '-progress'
            const lastProgress = localStorage.getItem(storageKey)
            this.continueReading = (lastProgress && lastProgress > 1) ? true : false
            if(browserFileStorage._init) {
                this.canDownload = true
            } else {
                browserFileStorage.init('farman')
                .then(status => {
                    this.canDownload = true
                })
                .catch(error => {
                    console.log(error)
                    this.$root.$emit('toast', "Erreur lors de l'initialisation du stockage")
                })
            }
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
                this.$root.$emit('toast', this.magazine.title + ' télechargé avec succès')
                this.checkIfPdfIsStored()
                analytics.logEvent('pdf_downloaded', {
                    name: this.magazine.title,
                    file_size: blob.size
                })
            }).catch(error => {
                console.error('Could not save the pdf :', file)
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
            this.$router.go(-1)
        }
    }
}
</script>