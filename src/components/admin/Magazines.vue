<template>
    <div>
        <input id="pdf-input" type="file" @change="upload" accept="application/pdf" />
        <button class="button">téléverser un pdf <i class="material-icons">publish</i></button>
        <progress id="pdf-progress" max="1" value="0"></progress>

        <ul v-if="pdfs">
            <li v-for="(pdf, i) in pdfs" v-bind:key="i">{{ pdf.name }} 
                <i @click="download(pdf)" class="material-icons">download</i>
                <i @click="open(pdf)" class="material-icons">open_in_new</i>
                <i @click="remove(pdf)" class="material-icons">delete</i>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
i {
    vertical-align: -25%;
}

#pdf-input {
    height: 42px;
    opacity: 0;
    position: absolute;
    cursor: pointer;
}

ul {
    list-style: none;
    margin: 16px 0;
    padding-left: 0;

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
const {storage} = require('../../firebaseConfig.js')
const files = storage.ref('magazines')

export default {
    data() {
        return {
            error: null,
            magazines: null,
            pdfs: null,
        }
    },
    methods: {
        getFiles() {
            this.pdfs = this.error = null
            files.listAll().then(res => {
                this.pdfs = []
                res.items.forEach(pdf => {
                    this.pdfs.push(pdf)
                })
            }).catch(err => {
                this.error = err
            })
        },
        open(storageRef) {
            storageRef.getDownloadURL().then((url) => {
                window.open(url)
            })
        },
        download(storageRef) {
            storageRef.getDownloadURL().then((url) => {
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    var blob = xhr.response;
                };
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
        }
    },
    mounted() {
        this.getFiles()
    }
}
</script>