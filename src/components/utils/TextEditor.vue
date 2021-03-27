<template>
    <div>
        <md-field>
            <label>Edition du texte</label>
            <md-textarea :md-counter="counter" :md-autogrow="true" v-model="content" @keyup="updateContent"></md-textarea>
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
    props: [
        'change',
        'height',
        'counter'
    ],
    data() {
        return {
            imageUploaderOpen: false,
            content: '',
        }
    },
    methods: {
        updateContent() {
            this.change(this.content)
        },
        imageUploaderClose() {
            this.imageUploaderOpen = false
        },
        insertMarkdownImage(url) {
            this.content += `![remplacer ici par une légende](${url})`
            this.change(this.content)
        }
    }
}
</script>