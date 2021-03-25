<template>
    <div g>
        <div>
            <md-field>
                <label>Textarea</label>
                <md-textarea v-model="content"></md-textarea>
            </md-field>

            <md-button @click="imageUploaderOpen = true">insérer une image</md-button>
            <image-uploader :callback="insertMarkdownImage" :open="imageUploaderOpen" :close="imageUploaderClose"></image-uploader>
        </div>

        <div>
            <vue-simple-markdown :source="content"></vue-simple-markdown>
        </div>
    </div>
</template>

<style lang="scss" scoped>
[g] {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 32px;
}
</style>

<script>
export default {
    components: {
        imageUploader: () => import('../utils/ImageUploader')
    },
    data() {
        return {
            imageUploaderOpen: false,
            content: '',
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