<template>
    <div>
        <ul v-if="comments">
            <li v-for="(comment, index) in comments" :key="index">
                {{ comment.content }}
                <textarea v-model="editableReply" cols="30" rows="10"></textarea>
                <button class="fm-button" @click="reply(comment.id)">Répondre</button>
                <div :ref="comment.id"
                v-observe-visibility="{
                    callback: loadReply(comment.id),
                    throttle: 250,
                    once: true
                }">
                    <ul v-if="replys[comment.id]">
                        <li v-for="(comment, index) in replys[comment.id]" :key="index">{{ comment.content }}</li>
                    </ul>
                </div>
            </li>
        </ul>
        <textarea v-model="editableComment" cols="30" rows="10"></textarea>
        <button class="fm-button" @click="send">Envoyer</button>
    </div>
</template>

<script>
import {serverTimestamp} from '../../firebaseConfig'
import {notificationsMixin} from '../../mixins/notifications'
const COLLECTION_NAME = 'comments'

export default {
    mixins: [notificationsMixin],
    props: ['doc'],
    data() {
        return {
            collection: this.doc.collection(COLLECTION_NAME),
            comments: null,
            replys: {},
            editableComment: '',
            editableReply: '',
            loadedReply: []
        }
    },
    methods: {
        fetchComments(replyId = false) {
            this.collection
            .orderBy('createdAt', 'desc')
            .where('replyTo', '==', replyId)
            .limit(10).get()
            .then(docs => {
                if(replyId) {
                    this.$set(this.replys, replyId, [])
                    docs.forEach(doc => {
                        this.replys[replyId].push({id: doc.id, ...doc.data()})
                    });
                    console.log(this.replys)
                } else {
                    this.comments = []
                    docs.forEach(doc => {
                        this.comments.push({id: doc.id, ...doc.data()})
                    });
                }
            })
            .catch(e => console.error(e))
        },
        loadReply(id) {
            if(this.loadedReply.includes(id)) return
            this.fetchComments(id)
            this.loadedReply.push(id)
        },
        async send() {
            await this.writeComment(this.editableComment, false)
            this.editableComment = ''
        },
        async reply(id) {
            await this.writeComment(this.editableReply ,id)
            this.editableReply = ''
        },
        async writeComment(text, replyId) {
            const token = await this.requestNotifications()
            return this.collection.add({
                uid: this.$root.user.uid,
                replyTo: replyId,
                fcmToken: token,
                photoURL: this.$root.user.photoURL,
                displayName: this.$root.user.displayName,
                content: text,
                createdAt: serverTimestamp,
            })
        }
    },
    mounted() {
        console.log(this.collection)
        this.fetchComments()
    }
}
</script>