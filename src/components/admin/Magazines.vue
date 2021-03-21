<template>
    <div class="grid">
        <div class="col">
            <div class="error" v-if="error">
                <p>Une erreur est survenue : <ins>{{ error }}</ins></p>
            </div>

            <input id="pdf-input" type="file" @change="upload" accept="application/pdf" />
            <button class="button">téléverser un pdf <i class="material-icons">publish</i></button>
            <progress id="pdf-progress" max="1" value="0"></progress>

            <ul v-if="pdfs">
                <p>Fichiers pdf</p>
                <li v-for="(pdf, i) in pdfs" v-bind:key="i">{{ pdf.name }} 
                    <i @click="download(pdf)" title="télécharger" class="material-icons">download</i>
                    <i @click="insertFileIntoEdition(pdf)" title="intégrer le pdf dans la zone d'édition" class="material-icons" :disabled="!currentEdit">shortcut</i>
                    <i @click="open(pdf)" title="ouvrir dans un nouvel onglet" class="material-icons">open_in_new</i>
                    <i @click="remove(pdf)" title="supprimer" class="material-icons">delete</i>
                </li>
            </ul>
            <ul v-if="pdfsLoading">
                <p>Chargement ...</p>
            </ul>

            <ul v-if="magazines">
                <p>Informations sur les magazines</p>
                <li v-for="(item, i) in magazines" v-bind:key="i">{{ item.title }}
                    <router-link :to="{ name: 'Magazine', params: { ref: item.id } }"><i title="visionner" class="material-icons">visibility</i></router-link>
                    <i @click="edit(item)" title="Modifier les informations" class="material-icons">edit</i>
                    <i @click="remove_db(item.id)" title="supprimer" class="material-icons">delete</i>
                </li>
                <button @click="currentEdit = {url: null, image: null}" class="button" publish>Publier un magazine <i class="material-icons">edit</i></button>
            </ul>
            <ul v-else>
                <p v-if="magazinesLoading">Chargement ...</p>
            </ul>
        </div>

        <div v-if="currentEdit" class="col">
            <div class="form-group">
                <input type="text" placeholder="Titre" v-model="currentEdit.title">
                <textarea cols="30" placeholder="Extrait" rows="10" v-model="currentEdit.summary"></textarea>
                <input type="text" placeholder="Lien du pdf" v-model="currentEdit.url">
                <input type="url" placeholder="Lien de l'image" v-model="currentEdit.image">
                
                <image-uploader :callback="appendImageUrl" :open="imageUploaderOpen" :close="imageUploaderClose"></image-uploader>
                <button class="button-outlined" @click="imageUploaderOpen = true">{{ currentEdit.image ? "Modifier l'image" : "Insérer une image" }}</button>
                <img height="128" :src="currentEdit.image">

                <br>
                <button @click="saveEdit(currentEdit.id)" class="button">{{ currentEdit.id ? 'Enregistrer' : 'Publier' }}</button>
                <button @click="undoEdit" class="button-outlined">Annuler</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.grid {
    display: grid;
    margin-top: 16px;
    grid-gap: 16px;

    .col {
        grid-row: 1;
        min-width: 480px;
    }
}

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

#pdf-input {
    height: 42px;
    opacity: 0;
    position: absolute;
    cursor: pointer;
}

[publish] {
    margin: 8px 0;
}

ul {
    list-style: none;
    margin: 16px 0;
    padding-left: 0;
    max-height: 50vh;
    overflow-y: scroll;

    li {
        padding: 16px;
        cursor: pointer;
        border-bottom: 1px solid #ddd;

        &:hover {
            background: rgba(150, 150, 150, 0.2);
        }

        i {
            float: right;
            margin-left: 16px;
        }
    }
}
</style>

<script>
const {storage, magazines, firebase} = require('../../firebaseConfig.js')
const files = storage.ref('magazines')

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
            imageUploaderOpen: false
        }
    },
    methods: {
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
            this.getMagazines()
        }
    },
    mounted() {
        this.getFiles()
        this.getMagazines()
    }
}
</script>