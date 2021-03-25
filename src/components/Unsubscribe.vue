<template>
    <div>
        <app-header></app-header>

        <main>
            <span>désinscription</span>
            <h1>Quitter la lettre d'informations ?</h1>
            <p>En cliquant sur le bouton ci-dessous, vous ne recevrez plus de mails d'informations de notre part. Vous continuerez cependant a recevoir des mails de connexion ou de récupération de compte, ainsi que des informations légales ci nécéssaire.</p>
            <md-button class="md-raised md-accent" @click="signOut">Quitter</md-button>
        </main>

        <app-footer></app-footer>
    </div>
</template>

<style lang="scss" scoped>
main {
    span {
        color: #999;
    }
}
</style>

<script>
const {db, firebase} = require('../firebaseConfig.js')

export default {
    components: {
        AppFooter: () => import('./Footer.vue'),
        AppHeader: () => import('./Navigation.vue')
    },
    data() {
        return {
            user: firebase.auth().currentUser
        }
    },
    methods: {
        signOut() {
            db.collection("mails")
                .where("mail", "==", this.user.email)
                .get().then(snapshot => {
                    snapshot.forEach(doc => {
                        doc.ref.delete().then(r => {
                            alert('Vous êtes bien désinscrit')
                        }).catch(err => {
                            alert(err)
                        })
                    })
            })
        }
    }
}
</script>