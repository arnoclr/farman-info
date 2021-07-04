<template>
    <div class="fm-comment">
        <router-link class="mr-8" :to="{ name: 'articleListAuthor', params: { author: comment.uid, ref: 'comments' } }">
            <img :src="comment.photoURL" alt="" class="fm-comment__avatar">
        </router-link>
        <div class="fm-comment__body">
            <span class="fm-comment__body-name">{{ comment.displayName }}</span>
            <span class="fm-comment__body-time">{{ timeAgo(comment.createdAt) }}</span>
            <span class="fm-comment__body-content" v-html="render(comment.content)"></span>
            
            <div class="fm-comment__body-reply" v-if="form && $root.user">
                <button class="fm-button fm-button--flat" @click="displayReply = comment.id">Répondre</button>
                <div class="fm-comment__body-reply-form" v-show="displayReply == comment.id">
                    <md-field class="fm-comment__body-reply-form-input">
                        <md-textarea v-model="editableReply" placeholder="Ajouter une réponse publique" md-counter="2048" md-autogrow></md-textarea>
                    </md-field>
                    <button class="fm-button" @click="reply(comment.id)"
                    :disabled="editableReply.length < 5 || editableReply.length > 2048">Répondre</button>
                    <button class="fm-button fm-button--flat" @click="displayReply = null">Annuler</button>
                </div>
            </div>

            <md-menu class="fm-comment__body-actions" md-direction="top-end">
                <md-button md-menu-trigger class="md-icon-button">
                    <md-icon>{{ $device.ios ? 'more_horiz' : 'more_vert' }}</md-icon>
                </md-button>

                <md-menu-content>
                    <a target="_blank" :href="'mailto:farman.bonjour@outlook.fr?subject=Signalement d\'un commentaire [' + comment.id + ']&body=Raison du signalement :'">
                        <md-menu-item>
                            <md-icon>flag</md-icon>
                            <span>Signaler</span>
                        </md-menu-item>
                    </a>
                    <md-menu-item @click="deleteComment(comment.id, comment.replyTo)">
                        <md-icon>delete</md-icon>
                        <span>Supprimer</span>
                    </md-menu-item>
                </md-menu-content>
            </md-menu>
        </div>
    </div>
</template>

<script>
import { format } from '../../assets/js/utils/timeago'

export default {
    props: ['comment', 'form'],
    data() {
        return {
            editableReply: '',
            displayReply: null,
        }
    },
    methods: {
        timeAgo(time) {
            return format(new Date(time.seconds * 1000), 'fr_FR')
        },
        render(text) {
            text = text.replaceAll(/[<=]/g, '')
            return text.replace(/> ?(.+)/g, (text, group) => {
                return `<details class="fm-comment__body-content-quote">
                    <summary>
                        <i class="material-icons">reply</i>
                        ${group.slice(0, 45)}...
                    </summary>
                    ${group}
                </details>`
            })
        },
        async reply(id) {
            await this.$parent.reply(this.editableReply, id)
            this.editableReply = ''
        },
        async deleteComment(id, replyTo) {
            await this.$parent.deleteComment(id, replyTo)
        }
    }
}
</script>