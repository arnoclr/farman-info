<template>
    <div>
        <md-dialog :md-active.sync="open" :md-click-outside-to-close="false">
            <md-dialog-title>Mes informations</md-dialog-title>

            <md-dialog-content v-if="editedUser">
                <md-field>
                    <label>Nom d'utilisateur</label>
                    <md-input v-model="editedUser.displayName"></md-input>
                </md-field>
                
                <img @click="imageUploaderOpen = true" :src="editedUser.photoURL">
                <br><span>Cliquez sur l'image pour la modifier</span>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="closeModal">Annuler</md-button>
                <md-button class="md-primary" @click="save">Enregistrer</md-button>
            </md-dialog-actions>
        </md-dialog>

        <image-uploader :callback="setPhoto" :open.sync="imageUploaderOpen"></image-uploader>
    </div>
</template>

<script>
import {auth} from '../../firebaseConfig'

export default {
    props: ['user', 'open'],
    components: {
        imageUploader: () => import('./ImageUploader')
    },
    data() {
        return {
            editedUser: null,
            imageUploaderOpen: false
        }
    },
    methods: {
        closeModal() {
            this.$emit('update:open', false)
        },
        save() {
            const user = auth.currentUser
            console.log(this.editedUser)
            user.updateProfile(this.editedUser)
            .then(() => {
                this.$root.$emit('toast', 'Informations mises à jour')
                this.closeModal()
            })
            .catch(err => {
                this.$root.$emit('alert', err)
            })
        },
        setPhoto(url) {
            this.editedUser.photoURL = url
        }
    },
    mounted() {
        this.editedUser = {
            displayName: this.user.displayName,
            photoURL: this.user.photoURL
        }
    }
}
</script>