<template>
    <div>

        <div class="fm-markdown">
            <editor 
                @change="updateContent"
                initialEditType="wysiwyg"
                height="calc(100vh - 300px)"
                :options="editorOptions"
                ref="toastuiEditor" />
            <span>{{ editableContent.length }}/{{ counter }}</span>
        </div>

        <image-uploader ref="uploader" :callback="false" :open.sync="imageUploaderOpen"></image-uploader>
    </div>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';

const BUCKET_URL = 'https://firebasestorage.googleapis.com/v0/b/actualites-aeronautiques.appspot.com/o/images'

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
            imageUploading: null,
            editableContent: '',
            overlayActive: false,
            editorOptions: {
                usageStatistics: false,
                hideModeSwitch: true,
                minHeight: '250px',
            },
        }
    },
    methods: {
        updateContent() {
            this.editableContent = this.$refs.toastuiEditor.invoke('getMarkdown')
            this.$emit('update:content', this.editableContent)
            localStorage.setItem('submit:draft', this.editableContent)
        },
        updateTextEditor() {
            if(this.editableContent.length === 0) return
            this.$refs.toastuiEditor.invoke('setMarkdown', this.editableContent)
        },
        initContent(markdown) {
            this.editableContent = markdown
            this.updateTextEditor()
        },
        imageUploaderClose() {
            this.imageUploaderOpen = false
        },
        async onImageUpload(blob, callback) {
            this.imageUploaderOpen = true
            const imageUrl = await this.$refs.uploader.getImageUrl(blob)
            callback(imageUrl, '')
            this.editableContent = this.editableContent.replaceAll(BUCKET_URL + '/', BUCKET_URL + '%2F')
            this.updateTextEditor()
        }
    },
    mounted() {
        this.$refs.toastuiEditor.editor.removeHook('addImageBlobHook')
        this.$refs.toastuiEditor.editor.addHook('addImageBlobHook', this.onImageUpload)

        this.editableContent = this.content

        this.updateTextEditor(this.content)

        let draft = localStorage.getItem('submit:draft')
        if(draft && this.$route.name !== 'articleEdit') {
            this.editableContent = draft
            this.updateTextEditor()
        }
    }
}
</script>