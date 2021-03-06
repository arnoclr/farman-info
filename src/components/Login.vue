<template>
    <div id="login">
        <section>
            <div class="col1">
                <div class="centered">
                    <h1>Farman</h1>
                    <p>Votre média d'informations sur l'aviation. Connectez pour contribuer ou pour commenter les articles.</p>
                    <router-link to="/">Revenir a l'accueil</router-link>
                </div>
            </div>
            <div class="col2">
                <div class="centered">
                    <h2>Bonjour !</h2>
                    <div id="firebaseui-auth-container"></div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
#login {
    height: 100vh;
}

section {
    display: flex;
    height: 100%;
}

.col1 {
    width: 50%;
    display: block;
    color: #fff;
    background: teal;
}

.col2 {
    width: 50%;
    text-align: center;
}

.centered {
    position: absolute;
    width: inherit;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 16px;
}
</style>

<script>
    import firebase from 'firebase'
    import 'firebaseui/dist/firebaseui.css'
    const fb = require('../firebaseConfig.js')

    export default {
        name: 'login',
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
                    tosUrl: 'https://farman.info/assets/Farman_Informations_Juridiques_13-12-2020.pdf',
                    // Privacy policy url.
                    privacyPolicyUrl: 'https://farman.info/assets/Farman_Informations_Juridiques_13-12-2020.pdf'
                }
                fb.ui.start('#firebaseui-auth-container', uiConfig)
            }
        }
    }
</script>