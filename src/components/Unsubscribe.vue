<template>
    <div>
        <app-header></app-header>

        <main>
            <div v-if="isSignedIn">
                <span>désinscription</span>
                <h1>Quitter la lettre d'informations ?</h1>
                <p>En cliquant sur le bouton ci-dessous, vous ne recevrez plus de mails d'informations de notre part. Vous continuerez cependant a recevoir des mails de connexion ou de récupération de compte, ainsi que des informations légales ci nécéssaire.</p>
                <md-button class="md-raised md-accent" @click="signOut">Quitter</md-button>
            </div>

            <div v-else>
                <md-empty-state
                    md-icon="email"
                    md-label="Vous n'êtes pas inscrit"
                    md-description="Vous n'avez jamais été inscrit ou vous vous êtes desinscrit récemment, pour vous réinscrire, cliquez sur le bouton ci-dessous.">
                    <router-link to="/?ref=unsubscribe_page">
                        <md-button class="md-primary md-raised">S'inscrire</md-button>
                    </router-link>
                </md-empty-state>
            </div>
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
            user: firebase.auth().currentUser,
            isSignedIn: false,
            snapshot: null,
        }
    },
    methods: {
        userIsSignedIn() {
            db.collection("mails")
                .where("mail", "==", this.user.email)
                .get().then(snapshot => {
                    this.isSignedIn = !snapshot.empty
                    this.snapshot = snapshot
            }).catch(err => {
                alert(err)
            })
        },
        signOut() {
            this.snapshot.forEach(doc => {
                doc.ref.delete().then(r => {
                    alert('Vous êtes bien désinscrit')
                    this.userIsSignedIn()
                }).catch(err => {
                    alert(err)
                })
            })
        }
    },
    mounted() {
        this.userIsSignedIn()
    }
}
</script>