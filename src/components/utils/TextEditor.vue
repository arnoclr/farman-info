<template>
    <div>
        <md-field>
            <label>Textarea</label>
            <md-textarea v-model="content"></md-textarea>
        </md-field>

        <md-button @click="imageUploaderOpen = true">insérer une image</md-button>
        <image-uploader :callback="insertMarkdownImage" :open="imageUploaderOpen" :close="imageUploaderClose"></image-uploader>
    </div>
</template>

<script>
export default {
    components: {
        imageUploader: () => import('../utils/ImageUploader')
    },
    data() {
        return {
            imageUploaderOpen: false,
            content: null,
        }
    },
    methods: {
        imageUploaderClose() {
            this.imageUploaderOpen = false
        },
        insertMarkdownImage(url) {
            this.content += `![remplacer ici par une légende](${url})`
        }
    }
}
</script>