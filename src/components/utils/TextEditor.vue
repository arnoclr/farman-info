<template>
    <div>

        <div @dragover="dragover" @dragleave="dragleave" @drop="drop">
            <div ref="editor"></div>
            <span>{{ editableContent.length }}/{{ counter }}</span>
        </div>

        <image-uploader ref="uploader" :callback="insertHtmlImage" :open.sync="imageUploaderOpen"></image-uploader>
    </div>
</template>

<script>
import * as Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import {parseMd} from '../../assets/js/utils/mdParse'
import TurndownService from 'turndown'

const tdsv = new TurndownService()
const BUCKET_URL = 'https://firebasestorage.googleapis.com/v0/b/actualites-aeronautiques.appspot.com'

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
            this.editableContent = tdsv.turndown(this.quill.root.innerHTML)
            this.$emit('update:content', this.editableContent)
            localStorage.setItem('submit:draft', this.editableContent)
        },
        updateTextEditor(text) {
            if(text.length === 0) return
            let result = parseMd(text)
            this.quill.root.innerHTML = result
        },
        initContent(text, event) {
            this.updateTextEditor(text)
        },
        imageUploaderClose() {
            this.imageUploaderOpen = false
        },
        insertHtmlImage(url) {
            const range = this.quill.getSelection(true)
            this.quill.setSelection(range.index + 1)
            this.quill.insertEmbed(range.index, 'image', url)
        },
        appendContent(text) {
            this.editableContent += text
            this.updateContent()
        },
    },
    mounted() {
        this.editableContent = this.content

        this.quill = new Quill(this.$refs.editor, {
            modules: { 
                toolbar: {
                    container: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'blockquote'],
                        ['image']
                    ],
                }
            },
            theme: 'snow'
        })
        var toolbar = this.quill.getModule('toolbar')
        toolbar.addHandler('image', () => {
            this.imageUploaderOpen = true
        })

        this.updateTextEditor(this.content)

        let draft = localStorage.getItem('submit:draft')
        if(draft && this.$route.name !== 'articleEdit') {
            this.updateTextEditor(draft)
        }

        const observer = new MutationObserver(mutation => {
            this.updateContent()
        })
        observer.observe(this.$refs.editor, {
            childList: true,
            attributes: true,
            subtree: true,
            characterData: true
        })
    }
}
</script>