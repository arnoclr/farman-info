<template>
    <div>
        <md-dialog :md-active.sync="open">
            <md-dialog-title>Insérer une image</md-dialog-title>

            <md-tabs md-dynamic-height>
                <md-tab md-label="importer" import>
                    <img src="https://ssl.gstatic.com/docs/picker/images/upload_background.png" alt="">
                    <progress id="img-progress" max="1" value="0"></progress>
                    <md-field>
                        <label>Image</label>
                        <md-file v-model="imageFile" accept="image/*" id="img-input" @change="compressImage"/>
                    </md-field>
                </md-tab>

                <md-tab md-label="à partie d'une url">
                    <md-field>
                        <label>Lien vers l'image</label>
                        <md-input v-model="fromUrl"></md-input>
                    </md-field>
                    <md-button @click="uploadImage(fromUrl)" class="md-raised md-primary">importer</md-button>
                </md-tab>
            </md-tabs>

            <md-dialog-actions>
                <md-button class="md-primary" @click="closeModal">fermer</md-button>
            </md-dialog-actions>
        </md-dialog>

        <md-dialog :md-active.sync="error">
            <div m>
                <h2>Erreur</h2>
                <span>{{ error }}</span>
            </div>
            <md-dialog-actions>
                <md-button class="md-primary" @click="error = null">fermer</md-button>
            </md-dialog-actions>
        </md-dialog>

    </div>
</template>

<style lang="scss" scoped>
[import] {
    text-align: center;

    img {
        height: 120px;
    }
}

[m] {
    margin: 16px;
}
</style>

<script>
import { v4 as uuidv4 } from 'uuid'
import imageCompression from 'browser-image-compression'

const {storage} = require('../../firebaseConfig.js')
const images = storage.ref('images')

export default {
    name: 'ImageUploadDialog',
    props: [
        'callback',
        'close',
        'open'
    ],
    data() {
        return {
            error: null,
            fromUrl: null,
            imageFile: null,
        }
    },
    methods: {
        closeModal() {
            this.close()
        },
        compressImage() {
            let img = document.getElementById('img-input').files[0]
            imageCompression(img, {
                maxSizeMB: 2,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            }).then(img => {
                this.uploadImage(img)
            }).catch(err => {
                this.error = err
            })
        },
        uploadImage(img) {
            let ref = images.child(uuidv4())
            let uploadTask = ref.put(img)

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes)
                    document.getElementById('img-progress').value = progress
                }, 
                (error) => {
                    this.error = error
                }, 
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        this.closeModal()
                        this.callback(downloadURL)
                    })
                }
            )
        },
    }
}
</script>