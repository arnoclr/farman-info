<template>
    <div>
        <md-field>
            <label>Edition du texte</label>
            <md-textarea id="te-ta" :md-counter="counter" :max="counter" :md-autogrow="true" v-model="content" @keyup="updateContent" required></md-textarea>
            <span class="md-helper-text">Brouillon enregistré</span>
        </md-field>

        <md-button @click="title" class="md-icon-button">
            <md-icon>title</md-icon>
        </md-button>
        <md-button @click="imageUploaderOpen = true" class="md-icon-button">
            <md-icon>add_a_photo</md-icon>
        </md-button>

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
            localStorage.setItem('submit:draft', this.content)
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
            this.content += text
            document.getElementById('te-ta').focus()
            this.updateContent()
        }
    },
    mounted() {
        let draft = localStorage.getItem('submit:draft')
        if(draft) {
            this.content = draft
            this.updateContent()
        }
    }
}
</script>