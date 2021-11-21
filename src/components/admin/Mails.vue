<template>
    <div>
        <div v-if="loading">
            <p>Chargement ...</p>
        </div>
        <div v-else>
            <a class="fm-button" :href="mailLink" v-if="mailLink">Envoyer un mail</a>
            <ul wrapper>
                <li v-for="(mail, index) in mails" v-bind:key="index">{{ mail.mail }}</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
div {
    margin-top: 16px;
}

[wrapper] {
    max-height: 80vh;
    overflow-y: scroll;
}
</style>

<script>
import { db } from '../../firebaseConfig.js'
import { getDocs, collection } from 'firebase/firestore'

const mails = collection(db, 'mails')

export default {
    data() {
        return {
            mails: null,
            loading: null,
            error: null,
            mailLink: 'mailto:farman.bonjour@outlook.fr?subject=Farman - '
        }
    },
    created() {
        this.getMails()
    },
    methods: {
        async getMails() {
            this.mails = this.error = null
            this.loading = true

            const mailsSnapshot = await getDocs(mails)
                
            this.loading = false
            this.mails = []
            
            mailsSnapshot.forEach(doc => {
                this.mails.push(doc.data())
                this.mailLink += `&bcc=${doc.data().mail}`
            })
        },
    }
}
</script>