<template>
    <div>
        <div class="error" v-if="error">
            <p>Une erreur est survenue : <ins>{{ error }}</ins></p>
        </div>

        <div v-if="pdfs" p>
            <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
                <md-table-toolbar>
                    <div class="md-toolbar-section-start">
                        <input id="pdf-input" type="file" @change="upload" accept="application/pdf" />
                        <button class="button">Importer <i class="material-icons">publish</i></button>
                        <progress id="pdf-progress" max="1" value="0"></progress>
                    </div>

                    <md-field md-clearable class="md-toolbar-section-end">
                        <md-input placeholder="Rechercher ou ajouter" v-model="search" @input="searchOnTable" />
                    </md-field>
                </md-table-toolbar>

                <md-table-empty-state
                    md-label="Aucun pdf trouvé"
                    :md-description="`Aucun résultat pour la recherche '${search}'. Essayez avec un terme différent ou importez un nouveau pdf.`">
                </md-table-empty-state>

                <md-table-row slot="md-table-row" slot-scope="{ item }">
                    <md-table-cell md-label="Name" md-sort-by="name">
                        {{ item.name }}
                        <div class="right">
                            <md-button @click="download(item)" title="télécharger" class="md-icon-button">
                                <md-icon>download</md-icon>
                            </md-button>
                            <md-button @click="open(item)" title="ouvrir dans un nouvel onglet" class="md-icon-button">
                                <md-icon>launch</md-icon>
                            </md-button>
                            <md-button @click="remove(item)" title="supprimer" class="md-icon-button">
                                <md-icon>delete</md-icon>
                            </md-button>
                        </div>
                    </md-table-cell>
                </md-table-row>
            </md-table>
        </div>
        <ul v-if="pdfsLoading">
            <p>Chargement ...</p>
        </ul>

        <div v-if="magazines">
            <md-table v-model="magazines" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
                <md-table-toolbar>
                    <div class="md-toolbar-section-start">
                        <button @click="currentEditDialog = true; currentEdit = {url: null, image: null}" class="button" publish>Publier un magazine <i class="material-icons">edit</i></button>
                    </div>
                </md-table-toolbar>

                <md-table-row slot="md-table-row" slot-scope="{ item }">
                    <md-table-cell md-label="Name" md-sort-by="name">
                        {{ item.title }}
                        <div class="right">
                            <router-link class="md-button md-icon-button" :to="{ name: 'Magazine', params: { ref: item.id } }">
                                <i title="visionner" class="material-icons">visibility</i>
                            </router-link>
                            <md-button @click="edit(item)" title="Modifier les informations" class="md-icon-button">
                                <md-icon>edit</md-icon>
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

                    <md-field>
                        <label>pdf</label>
                        <md-input v-model="currentEdit.url"></md-input>
                    </md-field>

                    <md-field>
                        <label>Image</label>
                        <md-input v-model="currentEdit.image"></md-input>
                    </md-field>
                    
                    <button class="button-outlined" @click="imageUploaderOpen = true">{{ currentEdit.image ? "Modifier l'image" : "Insérer une image" }}</button>
                    <img height="128" :src="currentEdit.image">
                </md-dialog-content>

                <md-dialog-actions>
                    <md-button class="md-primary" @click="undoEdit">annuler</md-button>
                    <md-button class="md-primary" @click="saveEdit(currentEdit.id)">{{ currentEdit.id ? 'Enregistrer' : 'Publier' }}</md-button>
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

#pdf-input {
    height: 42px;
    opacity: 0;
    position: absolute;
    cursor: pointer;
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
    float: right;

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

const searchByName = (items, term) => {
    if (term) {
        return items.filter(item => toLower(item.name).includes(toLower(term)))
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
            search: null,
            searched: []
        }
    },
    methods: {
        // table
        newUser () {
            window.alert('Noop')
        },
        searchOnTable () {
            this.searched = searchByName(this.pdfs, this.search)
        },
        // image upload
        appendImageUrl(url) {
            this.currentEdit.image = url
        },
        imageUploaderClose() {
            this.imageUploaderOpen = false
        },
        // pdf data
        getFiles() {
            this.pdfs = this.error = null
            this.pdfsLoading = true
            files.listAll().then(res => {
                this.pdfsLoading = false
                this.pdfs = []
                res.items.forEach(pdf => {
                    this.pdfs.push(pdf)
                })
                this.searched = this.pdfs
            }).catch(err => {
                this.pdfsLoading = false
                this.error = err
            })
        },
        open(storageRef) {
            storageRef.getDownloadURL().then((url) => {
                window.open(url)
            })
        },
        insertFileIntoEdition(storageRef) {
            storageRef.getDownloadURL().then((url) => {
                this.currentEdit.url = url
            })
        },
        download(storageRef) {
            storageRef.getDownloadURL().then((url) => {
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    var blob = xhr.response;
                };
                xhr.onerror = (err) => {
                    this.error = "Impossible de télécharger le document"
                }
                xhr.open('GET', url);
                xhr.send();
            })
        },
        remove(storageRef) {
            if(confirm('Supprimer ?')) {
                storageRef.delete().then(() => {
                    this.getFiles()
                }).catch(err => {
                    this.error = err
                });
            }
        },
        upload() {
            // 'file' comes from the Blob or File API
            let pdf = document.getElementById('pdf-input').files[0]
            let ref = files.child(pdf.name)
            let uploadTask = ref.put(pdf)

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                    document.getElementById('pdf-progress').value = progress
                }, 
                (error) => {
                    this.error = error
                }, 
                () => {
                    this.getFiles()
                }
            );
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
        this.getFiles()
        this.getMagazines()
    }
}
</script>