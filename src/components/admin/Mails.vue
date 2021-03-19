<template>
    <div>
        <div v-if="loading">
            <p>Chargement ...</p>
        </div>
        <div v-else>
            <a class="button-outlined" :href="mailLink" v-if="mailLink">Envoyer un mail</a>
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
const {db} = require('../../firebaseConfig.js')
const mails = db.collection('mails')

export default {
    data() {
        return {
            mails: null,
            loading: null,
            error: null,
            mailLink: 'mailto:farman.bonjour@outlook.com?subject=Farman - '
        }
    },
    created() {
        this.getMails()
    },
    methods: {
        getMails() {
            this.mails = this.error = null
            this.loading = true
            mails.get().then(snapshot => {
                this.loading = false
                this.mails = []
                snapshot.forEach(doc => {
                    this.mails.push(doc.data())
                    this.mailLink += `&bcc=${doc.data().mail}`
                })
            })
            .catch(err => {
                console.log(err)
                this.error = err
            })
        },
    }
}
</script>