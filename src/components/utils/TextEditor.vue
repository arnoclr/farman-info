<template>
    <div>

        <div @dragover="dragover" @dragleave="dragleave" @drop="drop">
            <div :class="overlayActive ? 'active' : ''" id="img-drop-zone">
                <md-empty-state
                    md-icon="upload"
                    md-label="Téléverser l'image"
                    md-description="Les images doivent être au format .jpg ou .png">
                </md-empty-state>
            </div>

            <!-- <md-field>
                <label>Edition du texte</label>
                <md-textarea id="te-ta" 
                    :md-counter="counter" :max="counter" :md-autogrow="true" v-model="editableContent" 
                    @keyup="updateContent" @paste="pasteImage" required></md-textarea>
                <span class="md-helper-text">Brouillon enregistré</span>
            </md-field> -->
            <div id="quill-editor"></div>
        </div>

        <md-button @click="imageUploaderOpen = true" class="md-icon-button">
            <md-icon>add_a_photo</md-icon>
            <md-tooltip md-delay="300">Ajouter une image</md-tooltip>
        </md-button>

        <image-uploader ref="uploader" :callback="insertMarkdownImage" :open.sync="imageUploaderOpen"></image-uploader>
    </div>
</template>

<style lang="scss">
#img-drop-zone {
    height: 100%;
    width: 100%;
    position: fixed;
    display: flex;
    align-items: center;
    z-index: 0;
    top: 0;
    left: 0;
    background-color: #008080CC;
    opacity: 0;
    transition: opacity 150ms ease;

    i, strong, p {
        color: #fff !important;
    }

    &.active {
        opacity: 1;
    }

    #quill-editor {
        z-index: 1;
    }
}
</style>

<script>
import * as Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

export default {
    components: {
        imageUploader: () => import('../utils/ImageUploader')
    },
    props: [
        'content',
        'counter'
    ],
    data() {
        return {
            imageUploaderOpen: false,
            editableContent: '',
            overlayActive: false,
            quill: null,
        }
    },
    methods: {
        // drag events
        dragover(e) {
            e.preventDefault()
            this.overlayActive = true
        },
        dragleave(e) {
            e.preventDefault()
            this.overlayActive = false
        },
        drop(e) {
            e.preventDefault()
            this.overlayActive = false
            this.$refs.uploader.compressImage(e.dataTransfer.files[0])
            this.imageUploaderOpen = true
        },
        // clipboard image
        pasteImage(e) {
            const cdata = e.clipboardData || window.clipboardData
            const file = cdata.files[0]
            if(file) {
                this.$refs.uploader.compressImage(file)
                this.imageUploaderOpen = true
            }
        },
        updateContent() {
            this.$emit('update:content', this.editableContent)
            localStorage.setItem('submit:draft', this.editableContent)
        },
        initContent(text, event) {
            this.editableContent = text
        },
        imageUploaderClose() {
            this.imageUploaderOpen = false
        },
        insertMarkdownImage(url) {
            this.appendContent(`\n![texte alternatif](${url})\n`)
        },
        appendContent(text) {
            this.editableContent += text
            this.updateContent()
        },
    },
    mounted() {
        this.editableContent = this.content
        let draft = localStorage.getItem('submit:draft')
        if(draft && this.$route.name !== 'articleEdit') {
            this.editableContent = draft
        }
        this.updateContent()
        this.quill = new Quill('#quill-editor', {
            theme: 'snow'
        })
    }
}
</script>