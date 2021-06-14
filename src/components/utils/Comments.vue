<template>
    <div>
        <ul v-if="comments">
            <li v-for="(comment, index) in comments" :key="index">
                {{ comment.content }}
            </li>
        </ul>
        <textarea v-model="editableComment" cols="30" rows="10"></textarea>
        <button class="fm-button" @click="writeComment">Envoyer</button>
    </div>
</template>

<script>
import {serverTimestamp} from '../../firebaseConfig'
const COLLECTION_NAME = 'comments'

export default {
    props: ['doc'],
    data() {
        return {
            collection: this.doc.collection(COLLECTION_NAME),
            comments: null,
            editableComment: ''
        }
    },
    methods: {
        fetchComments() {
            this.collection.orderBy('createdAt', 'desc').limit(10).get()
            .then(docs => {
                this.comments = []
                docs.forEach(doc => {
                    this.comments.push(doc.data())
                });
            })
            .catch(e => console.error(e))
        },
        writeComment() {
            this.collection.add({
                uid: this.$root.user.uid,
                photoURL: this.$root.user.photoURL,
                displayName: this.$root.user.displayName,
                content: this.editableComment,
                createdAt: serverTimestamp,
            })
            .then(() => {
                this.editableComment = ''
            })
        }
    },
    mounted() {
        console.log(this.collection)
        this.fetchComments()
    }
}
</script>