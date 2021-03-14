<template>
    <div>
        <app-header></app-header>

        <div id="login">
            <h1>Bonjour !</h1>
            <div id="firebaseui-auth-container"></div>
        </div>

        <app-footer></app-footer>

        <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/4.8.0/firebase-ui-auth.css" />
    </div>
</template>

<style scoped>
#login {
    padding: 16px;
}
</style>

<script>
    import firebase from 'firebase'
    import 'firebaseui/dist/firebaseui.css'
    const fb = require('../firebaseConfig.js')

    export default {
        name: 'login',
        components: {
            AppFooter: () => import('./Footer.vue'),
            AppHeader: () => import('./Navigation.vue')
        },
        mounted() {
            if(firebase.auth().currentUser) {
                this.$router.push('')
            } else {
                var uiConfig = {
                    signInSuccessUrl: '/',
                    signInOptions: [
                        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                        firebase.auth.EmailAuthProvider.PROVIDER_ID
                    ],
                    // Terms of service url.
                    tosUrl: 'https://farman.ga/s/cgu',
                    // Privacy policy url.
                    privacyPolicyUrl: 'https://farman.ga/s/cgu'
                }
                fb.ui.start('#firebaseui-auth-container', uiConfig)
            }
        }
    }
</script>