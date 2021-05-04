<template>
    <div>
        <app-header></app-header>

        <div class="divided">
            <main>
                <div v-if="isSignedIn">
                    <span>désinscription</span>
                    <h1>Quitter la lettre d'informations ?</h1>
                    <p>En cliquant sur le bouton ci-dessous, vous ne recevrez plus de mails d'informations de notre part. Vous continuerez cependant à recevoir des mails de connexion ou de récupération de compte, ainsi que des informations légales si nécéssaire.</p>
                    <button class="fm-button fm-button--outlined" @click="signOut">Quitter</button>
                </div>

                <div v-else>
                    <md-empty-state
                        md-icon="email"
                        md-label="Vous n'êtes pas inscrit"
                        md-description="Vous n'avez jamais été inscrit ou vous vous êtes desinscrit récemment, pour vous réinscrire, cliquez sur le bouton ci-dessous.">
                        <router-link class="fm-button" to="/?ref=unsubscribe_page">S'inscrire</router-link>
                    </md-empty-state>
                </div>
            </main>

            <app-sidebar></app-sidebar>
        </div>

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
const {db, firebase, analytics} = require('../firebaseConfig.js')

export default {
    components: {
        AppFooter: () => import('./Footer.vue'),
        AppHeader: () => import('./Navigation.vue'),
        AppSidebar: () => import('./utils/Sidebar.vue')
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
                    let urlParams = new URLSearchParams('?' + this.$route.fullPath.split('?')[1])
                    analytics.logEvent('unsubscribe', { from: urlParams.get('ref') || 'unknow'})
                    this.$root.$emit('alert', 'Vous êtes bien désinscrit')
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