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

            <md-field>
                <label>Edition du texte</label>
                <md-textarea id="te-ta" 
                    :md-counter="counter" :max="counter" :md-autogrow="true" v-model="editableContent" 
                    @keyup="updateContent" @paste="pasteImage" required></md-textarea>
                <span class="md-helper-text">Brouillon enregistré</span>
            </md-field>
        </div>

        <md-button @click="title" class="md-icon-button">
            <md-icon>title</md-icon>
            <md-tooltip md-delay="300">Ajouter un titre</md-tooltip>
        </md-button>
        <md-button @click="italic" class="md-icon-button">
            <md-icon>format_italic</md-icon>
            <md-tooltip md-delay="300">Mettre en italique</md-tooltip>
        </md-button>
        <md-button @click="bold" class="md-icon-button">
            <md-icon>format_bold</md-icon>
            <md-tooltip md-delay="300">Mettre en gras</md-tooltip>
        </md-button>
        <md-button @click="quote" class="md-icon-button">
            <md-icon>format_quote</md-icon>
            <md-tooltip md-delay="300">Intégrer une citation</md-tooltip>
        </md-button>
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
}
</style>

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
            overlayActive: false
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
        // format text
        // https://jsfiddle.net/ourcodeworld/o4k7rfu0/1/
        getInputSelection() {
            const el = document.getElementById('te-ta')
            el.focus()
            let start = 0, end = 0, normalizedValue, range,
                textInputRange, len, endRange

            if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
                start = el.selectionStart
                end = el.selectionEnd
            } else {
                range = document.selection.createRange()

                if (range && range.parentElement() == el) {
                    len = el.value.length
                    normalizedValue = el.value.replace(/\r\n/g, "\n")

                    // Create a working TextRange that lives only in the input
                    textInputRange = el.createTextRange()
                    textInputRange.moveToBookmark(range.getBookmark())

                    // Check if the start and end of the selection are at the very end
                    // of the input, since moveStart/moveEnd doesn't return what we want
                    // in those cases
                    endRange = el.createTextRange()
                    endRange.collapse(false)

                    if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                        start = end = len
                    } else {
                        start = -textInputRange.moveStart("character", -len)
                        start += normalizedValue.slice(0, start).split("\n").length - 1

                        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                            end = len
                        } else {
                            end = -textInputRange.moveEnd("character", -len)
                            end += normalizedValue.slice(0, end).split("\n").length - 1
                        }
                    }
                }
            }

            if(start == end) {
                this.$root.$emit('toast', 'Aucun texte selectionné')
                return false
            }

            return { start, end }
        },
        insertAt(index, schema) {
            this.editableContent = this.editableContent.substr(0, index) + schema + this.editableContent.substr(index)
        },
        title() {
            this.appendContent('\n# ')
        },
        italic() {
            this.appendBeforeAndAfter('*')
        },
        bold() {
            this.appendBeforeAndAfter('**')
        },
        quote() {
            this.appendContent('\n> ')
        },
        appendContent(text) {
            this.editableContent += text
            document.getElementById('te-ta').focus()
            this.updateContent()
        },
        appendBeforeAndAfter(schema) {
            const delimiters = this.getInputSelection()
            // detect if selected string contain schema
            const schemaSize = schema.length
            let startString = ''
            for (let index = delimiters.start - schemaSize; index < delimiters.start + schemaSize + 1; index++) {
                startString += this.editableContent.charAt(index)
            }
            if(startString.includes(schema)) {
                
            } else if(delimiters) {
                this.insertAt(delimiters.end, schema)
                this.insertAt(delimiters.start, schema)
            }
        }
    },
    mounted() {
        this.editableContent = this.content
        let draft = localStorage.getItem('submit:draft')
        if(draft && this.$route.name !== 'articleEdit') {
            this.editableContent = draft
        }
        this.updateContent()
    }
}
</script>