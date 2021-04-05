<template>
    <div>
        <md-field>
            <label>Edition du texte</label>
            <md-textarea id="te-ta" :md-counter="counter" :max="counter" :md-autogrow="true" v-model="editableContent" @keyup="updateContent" required></md-textarea>
            <span class="md-helper-text">Brouillon enregistré</span>
        </md-field>

        <md-button @click="title" class="md-icon-button">
            <md-icon>title</md-icon>
        </md-button>
        <md-button @click="imageUploaderOpen = true" class="md-icon-button">
            <md-icon>add_a_photo</md-icon>
        </md-button>

        <image-uploader :callback="insertMarkdownImage" :open.sync="imageUploaderOpen"></image-uploader>
    </div>
</template>

<script>
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
        }
    },
    methods: {
        updateContent() {
            this.$emit('update:content', this.editableContent)
            localStorage.setItem('submit:draft', this.editableContent)
        },
        imageUploaderClose() {
            this.imageUploaderOpen = false
        },
        insertMarkdownImage(url) {
            this.appendContent(`\n![remplacer ici par une légende](${url})\n`)
        },
        title() {
            this.appendContent('\n# ')
        },
        appendContent(text) {
            this.editableContent += text
            document.getElementById('te-ta').focus()
            this.updateContent()
        }
    },
    mounted() {
        this.editableContent = this.content
        let draft = localStorage.getItem('submit:draft')
        if(draft) {
            this.editableContent = draft
            this.updateContent()
        }
    }
}
</script>