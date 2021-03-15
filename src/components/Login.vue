<template>
    <div>
        <app-header></app-header>

        <div id="login">
            <h1>Bonjour !</h1>
            <div id="firebaseui-auth-container"></div>
        </div>

        <app-footer></app-footer>
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
                this.$router.push('/')
            } else {
                var uiConfig = {
                    signInSuccessUrl: '/',
                    signInOptions: [
                        {
                            // Google provider must be enabled in Firebase Console to support one-tap
                            // sign-up.
                            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                            // Required to enable ID token credentials for this provider.
                            // This can be obtained from the Credentials page of the Google APIs
                            // console. Use the same OAuth client ID used for the Google provider
                            // configured with GCIP or Firebase Auth.
                            clientId: '972782309534-8jujt6cg8uf0u11gv2smbkasee3k35cm.apps.googleusercontent.com',
                        },
                        {
                            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                            // Use email link authentication and do not require password.
                            // Note this setting affects new users only.
                            // For pre-existing users, they will still be prompted to provide their
                            // passwords on sign-in.
                            signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
                            // Allow the user the ability to complete sign-in cross device, including
                            // the mobile apps specified in the ActionCodeSettings object below.
                            forceSameDevice: false,
                        },
                        {
                            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                            recaptchaParameters: {
                                type: 'image', // 'audio'
                                size: 'normal', // 'invisible' or 'compact'
                                badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
                            },
                            defaultCountry: 'FR'
                        }
                    ],
                    credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
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