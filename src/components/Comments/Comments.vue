<template>
    <div>
        <div class="fm-comments__form" v-if="$root.user">
            <md-field class="fm-comments__form-input">
                <md-textarea v-model="editableComment" placeholder="Ajouter un commentaire public..." md-counter="2048" md-autogrow></md-textarea>
            </md-field>
            <div class="fm-comments__form-buttons">
                <button class="fm-button fm-button--flat" @click="editableComment = ''"
                :disabled="editableComment.length == 0">Annuler</button>
                <button class="fm-button" @click="send" 
                :disabled="editableComment.length < 5 || editableComment.length > 2048">Ajouter un commentaire</button>
            </div>
        </div>
        <ul class="fm-comments" v-if="comments">
            <li v-for="(comment, index) in comments" :key="index">
                <comment :comment="comment" :form="true"></comment>
                <div
                :ref="comment.id"
                v-observe-visibility="{
                    callback: loadReply(comment.id),
                    throttle: 250,
                    once: true
                }">
                    <ul class="fm-comments fm-comments--nested" v-if="replys[comment.id] && replys[comment.id].length > 0">
                        <li class="fm-comment" v-for="(comment, index) in replys[comment.id]" :key="index">
                            <comment :comment="comment" :form="false"></comment>
                        </li>
                        <button 
                            class="fm-button fm-button--outlined ml-32" 
                            @click="fetchMore(comment.id)"
                            v-if="!allReplysLoaded[comment.id]">Charger plus de réponses</button>
                    </ul>
                </div>
            </li>
        </ul>
        <div class="p-16">
            <button 
                class="fm-button fm-button--outlined fm-button--full" 
                @click="fetchMore(false)" 
                v-if="!allCommentsLoaded">Afficher plus</button>
        </div>
        <md-empty-state
            md-icon="rate_review"
            md-label="Aucun commentaire ..."
            md-description="Soyez le premier a exprimer votre avis sur cet article.">
            <router-link :to="{ name: 'Login', params: { ref: 'comments'} }" 
            class="fm-button" v-if="!$root.user">Me connecter</router-link>
        </md-empty-state>
    </div>
</template>

<script>
import {serverTimestamp} from '../../firebaseConfig'
import {notificationsMixin} from '../../mixins/notifications'
const COLLECTION_NAME = 'comments'
const FETCH_NUM = 5

export default {
    mixins: [notificationsMixin],
    components: {
        Comment: () => import('./Comment.vue')
    },
    props: ['doc'],
    data() {
        return {
            collection: this.doc.collection(COLLECTION_NAME),
            comments: null,
            allCommentsLoaded: false,
            allReplysLoaded: {},
            replys: {},
            editableComment: '',
            loadedReply: []
        }
    },
    methods: {
        fetchMore(replyId) {
            const lastComment = replyId
                ? this.replys[replyId][this.replys[replyId].length - 1]
                : this.comments[this.comments.length - 1]
            this.fetchComments(replyId, lastComment)
        },
        fetchComments(replyId = false, lastComment = false) {
            let query = this.collection
                .orderBy('createdAt', 'desc')
                .where('replyTo', '==', replyId)
            query = lastComment ? query.startAfter(lastComment.createdAt) : query
            query = query.limit(FETCH_NUM)
            query.get().then(docs => {
                if(replyId) {
                    if(!lastComment) {
                        this.$set(this.replys, replyId, [])
                    }
                    let state = false
                    if(docs.size < FETCH_NUM || docs.empty) {
                        state = true
                    }
                    this.$set(this.allReplysLoaded, replyId, state)
                    docs.forEach(doc => {
                        this.replys[replyId].push({id: doc.id, ...doc.data()})
                    })
                } else {
                    if(docs.size < FETCH_NUM || docs.empty) {
                        this.allCommentsLoaded = true
                    }
                    if(!lastComment) {
                        this.comments = []
                    }
                    docs.forEach(doc => {
                        this.comments.push({id: doc.id, ...doc.data()})
                    })
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
            const comment = await this.writeComment(this.editableComment, false)
            this.comments.unshift(comment)
            this.editableComment = ''
        },
        async reply(text, id) {
            const comment = await this.writeComment(text ,id)
            this.replys[id].unshift(comment)
        },
        async writeComment(text, replyId) {
            if(text.length < 5) {
                return this.$root.$emit('toast', 'Commentaire trop court')
            }
            const token = await this.requestNotifications()
            const comment = {
                uid: this.$root.user.uid,
                replyTo: replyId,
                fcmToken: token,
                photoURL: this.$root.user.photoURL,
                displayName: this.$root.user.displayName,
                content: text,
                createdAt: serverTimestamp,
            }
            await this.collection.add(comment)
            return comment
        },
        async deleteComment(id, replyId = false) {
            if(!confirm('Supprimer le commentaire et les réponses associées ?')) return
            await this.collection.doc(id).delete()
            const commentObj = this.comments.find(o => o.id === id)
            if(commentObj) {
                const index = this.comments.indexOf(commentObj)
                if (index > -1) {
                    this.comments.splice(index, 1)
                }
            } else if(replyId) {
                this.fetchComments(replyId)
            }
        }
    },
    mounted() {
        console.log(this.collection)
        this.fetchComments()
    }
}
</script>