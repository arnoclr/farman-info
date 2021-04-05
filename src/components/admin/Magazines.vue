<template>
    <div>
        <div class="error" v-if="error">
            <p>Une erreur est survenue : <ins>{{ error }}</ins></p>
        </div>

        <md-dialog :md-active.sync="requestPdfOpen" :md-click-outside-to-close="false">
            <md-dialog-title>Ajouter le pdf</md-dialog-title>
            <md-dialog-content>
                <small>{{ currentPdfId }}</small>
                <progress id="pdf-progress" max="1" value="0"></progress>
                <input id="pdf-input" type="file" @change="uploadPdf" accept="application/pdf" />
            </md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-primary" @click="requestPdfOpen = false" :disabled="pdfIsUploading">Annuler</md-button>
            </md-dialog-actions>
        </md-dialog>

        <div v-if="magazines">
            <md-table v-model="searched" md-sort="title" md-sort-order="asc" md-card md-fixed-header>
                <md-table-toolbar>
                    <div class="md-toolbar-section-start">
                        <button @click="currentEditDialog = true; currentEdit = {url: null, image: null}" class="button" publish>Publier un magazine <i class="material-icons">edit</i></button>
                    </div>

                    <md-field md-clearable class="md-toolbar-section-end">
                        <md-input placeholder="Rechercher par titre" v-model="search" @input="searchOnTable" />
                    </md-field>
                </md-table-toolbar>

                <md-table-empty-state
                    md-label="Aucun magazine"
                    :md-description="`'${search}' ne correpond à aucun magazine publié, réessayez avec un autre terme de recherche ou vérifiez la syntaxe.`">
                </md-table-empty-state>

                <md-table-row slot="md-table-row" slot-scope="{ item }">
                    <md-table-cell md-label="Titre" md-sort-by="title">
                        {{ item.title }}
                        <div class="right">
                            <md-button @click="viewPage(item.id)" title="Modifier les informations" class="md-icon-button">
                                <md-icon>visibility</md-icon>
                            </md-button>
                            <md-button @click="edit(item)" title="Modifier les informations" class="md-icon-button">
                                <md-icon>edit</md-icon>
                            </md-button>
                            <md-button @click="requestPdf(item.id)" title="Publier le pdf du magazine" class="md-icon-button">
                                <md-icon>picture_as_pdf</md-icon>
                            </md-button>
                            <md-button @click="remove_db(item.id)" title="supprimer" class="md-icon-button">
                                <md-icon>delete</md-icon>
                            </md-button>
                        </div>
                    </md-table-cell>
                </md-table-row>
            </md-table>
        </div>
        <ul v-else>
            <p v-if="magazinesLoading">Chargement ...</p>
        </ul>

        <div v-if="currentEdit">
            <md-dialog :md-active.sync="currentEditDialog" md-fullscreen>
                <md-dialog-title>Edition</md-dialog-title>
                <md-dialog-content c>
                    <md-field>
                        <label>Titre</label>
                        <md-input v-model="currentEdit.title"></md-input>
                    </md-field>

                    <md-field>
                        <label>Extrait</label>
                        <md-textarea v-model="currentEdit.summary"></md-textarea>
                    </md-field>
                    
                    <button class="button-outlined" @click="imageUploaderOpen = true">{{ currentEdit.image ? "Modifier l'image" : "Insérer une image" }}</button>
                    <img height="128" :src="currentEdit.image">
                </md-dialog-content>

                <md-dialog-actions>
                    <md-button class="md-primary" @click="undoEdit">annuler</md-button>
                    <md-button class="md-primary" @click="saveEdit(currentEdit.id)">{{ currentEdit.id ? 'Enregistrer' : 'Suivant' }}</md-button>
                </md-dialog-actions>
            </md-dialog>

            <image-uploader :callback="appendImageUrl" :open="imageUploaderOpen" :close="imageUploaderClose"></image-uploader>
        </div>
    </div>
</template>

<style lang="scss" scoped>
i {
    vertical-align: -25%;

    &[disabled] {
        opacity: 0.5;
        pointer-events: none;
    }

    &:hover {
        color: teal;
    }
}

button {
    display: flex;
}

[publish] {
    margin: 8px 0;
}

[c] {
    min-width: 580px;

    img {
        height: 128px;
    }
}

[p] {
    margin-bottom: 16px;
}

.right {
    position: absolute;
    right: 0;
    top: 0;
    margin: 4px;

    .md-icon-button {
        display: inline-flex;
    }
}
</style>

<script>
const {storage, magazines, firebase} = require('../../firebaseConfig.js')
const files = storage.ref('magazines')

const toLower = text => {
    return text.toString().toLowerCase()
}

const searchByTitle = (items, term) => {
    if (term) {
        return items.filter(item => toLower(item.title).includes(toLower(term)))
    }

    return items
}

export default {
    components: {
        imageUploader: () => import('../utils/ImageUploader')
    },
    data() {
        return {
            error: null,
            magazines: null,
            magazinesLoading: null,
            pdfs: null,
            pdfsLoading: null,
            currentEdit: null,
            currentEditDialog: false,
            imageUploaderOpen: false,
            requestPdfOpen: false,
            currentPdfId: null,
            pdfIsUploading: false,
            search: null,
            searched: []
        }
    },
    methods: {
        searchOnTable () {
            this.searched = searchByTitle(this.magazines, this.search)
        },
        // image upload
        appendImageUrl(url) {
            this.currentEdit.image = url
        },
        imageUploaderClose() {
            this.imageUploaderOpen = false
        },
        viewPage(id) {
            this.$router.push('/magazine/' + id)
        },
        // PDF upload
        requestPdf(id) {
            this.requestPdfOpen = true
            this.currentPdfId = id
        },
        uploadPdf() {
            // 'file' comes from the Blob or File API
            let pdf = document.getElementById('pdf-input').files[0]
            let ref = files.child(this.currentPdfId + '.pdf')
            let uploadTask = ref.put(pdf)
            this.pdfIsUploading = true

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                    document.getElementById('pdf-progress').value = progress
                }, 
                (error) => {
                    this.error = error
                    this.pdfIsUploading = false
                }, 
                () => {
                    this.getPdfLinkFrom(this.currentPdfId)
                    this.pdfIsUploading = false
                }
            );
        },
        getPdfLinkFrom(id) {
            files.child(id + '.pdf').getDownloadURL().then((url) => {
                this.insertPdfLink(id, url)
            })
        },
        insertPdfLink(id, url) {
            magazines.doc(id).update({url: url}).then(res => {
                this.getMagazines()
                this.requestPdfOpen = false
            }).catch(err => {
                this.$root.$emit('toast', err)
                this.requestPdfOpen = false
            })
        },
        // magazines data
        getMagazines() {
            this.error = null
            this.magazinesLoading = true
            magazines.get().then(snapshot => {
                this.magazinesLoading = false
                this.magazines = []
                snapshot.forEach(doc => {
                    let buffer = doc.data()
                    buffer.id = doc.id
                    this.magazines.push(buffer)
                })
                this.searched = this.magazines
            })
            .catch(err => {
                console.log(err)
                this.magazinesLoading = false
                this.error = err
            })
        },
        remove_db(id) {
            if(confirm('Supprimer ?')) {
                magazines.doc(id).delete().then(res => {
                    this.getMagazines()
                }).catch(err => {
                    this.error = err
                })
            }
        },
        add_db() {
            this.currentEdit.date = firebase.firestore.Timestamp.fromDate(new Date());
            magazines.add(this.currentEdit).then(ref => {
                this.undoEdit()
                this.requestPdf(ref.id)
            }).catch(err => {
                this.error = err
            })
        },
        edit(item) {
            this.currentEdit = item
            this.currentEditDialog = true
        },
        saveEdit(id = null) {
            if(id != null) {
                magazines.doc(id).update(this.currentEdit).then(res => {
                    this.undoEdit()
                }).catch(err => {
                    this.error = err
                })
            } else {
                this.add_db()
            }
        },
        undoEdit() {
            this.currentEdit = null
            this.currentEditDialog = false
            this.getMagazines()
        }
    },
    mounted() {
        this.getMagazines()
    }
}
</script>