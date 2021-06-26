<template>
    <div>

        <div class="fm-markdown">
            <editor 
                @change="updateContent"
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
                hideModeSwitch: true
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
        imageUploaderClose() {
            this.imageUploaderOpen = false
        },
        insertHtmlImage(url) {
            this.editableContent += `![](${url})`
            this.updateTextEditor()
        },
        async onImageUpload(blob, callback) {
            this.imageUploaderOpen = true
            const imageUrl = await this.$refs.uploader.getImageUrl(blob)
            callback(imageUrl, '')
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