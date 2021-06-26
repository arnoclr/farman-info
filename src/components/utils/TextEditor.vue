<template>
    <div>

        <div class="fm-markdown">
            <editor 
                @change="updateContent"
                @paste="pasteImage"
                initialEditType="wysiwyg"
                :options="editorOptions"
                ref="toastuiEditor" />
            <span>{{ editableContent.length }}/{{ counter }}</span>
        </div>

        <image-uploader ref="uploader" :callback="insertHtmlImage" :open.sync="imageUploaderOpen"></image-uploader>
    </div>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';

const BUCKET_URL = 'https://firebasestorage.googleapis.com/v0/b/actualites-aeronautiques.appspot.com'

export default {
    components: {
        imageUploader: () => import('../utils/ImageUploader'),
        editor: Editor
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
            editorOptions: {
                hideModeSwitch: true
            }
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
            let file = e.dataTransfer.files[0]
            if(file == undefined) return
            this.$refs.uploader.compressImage(file)
            this.imageUploaderOpen = true
        },
        // clipboard image
        pasteImage(e) {
            e.stopPropagation()
            const cdata = e.clipboardData || window.clipboardData
            const html = cdata.getData('text/html') || ''
            const parsed = new DOMParser().parseFromString(html, 'text/html')
            const img = parsed.querySelector('img')
            if(!img) return
            const url = img.src;
            if(url.includes(BUCKET_URL)) {
                // return
                return this.insertHtmlImage(url)
            }
            const file = cdata.files[0]
            if(file) {
                this.$refs.uploader.compressImage(file)
                this.imageUploaderOpen = true
            }
        },
        updateContent() {
            this.editableContent = this.$refs.toastuiEditor.invoke('getMarkdown')
            this.$emit('update:content', this.editableContent)
            localStorage.setItem('submit:draft', this.editableContent)
            this.replaceBase64()
        },
        updateTextEditor() {
            if(this.editableContent.length === 0) return
            this.$refs.toastuiEditor.invoke('setMarkdown', this.editableContent)
        },
        imageUploaderClose() {
            this.imageUploaderOpen = false
        },
        // TODO: fix double image replacement
        replaceBase64() {
            this.editableContent = this.editableContent.replace(/!\[.+\]\((data:image\/png;base64,.+)\)/g, (md, g1) => {
                fetch(g1)
                .then(res => res.blob())
                .then(res => {
                    this.$refs.uploader.compressImage(res)
                    this.imageUploaderOpen = true
                })
                return ''
            })
        },
        insertHtmlImage(url) {
            this.editableContent += `![](${url})`
            this.updateTextEditor()
        }
    },
    mounted() {
        this.editableContent = this.content

        this.updateTextEditor(this.content)

        let draft = localStorage.getItem('submit:draft')
        if(draft && this.$route.name !== 'articleEdit') {
            this.updateTextEditor(draft)
        }
    }
}
</script>