<template>
    <div>
        <div root>
            <app-header class="transparent" transparent="true"></app-header>

            <main>
                <div id="login">
                    <div class="centered">
                        <h1>Connexion</h1>
                        <p>Connectez-vous à votre espace MyFarman pour commenter et poster des articles.</p>
                    </div>
                    <div id="firebaseui-auth-container"></div>
                </div>
            </main>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<style>

</style>

<style lang="scss" scoped>
[root] {
    background: url('https://i.imgur.com/0iUBgjU.webp');
    background-size: cover;
    background-attachment: fixed;

    #login {
        padding: 16px;
        min-height: calc(100vh - 120px);
        display: grid;
        justify-content: center;

        .centered {
            text-align: center;
            max-width: 380px;

            h1, p {
                color: #fff;
            }
        }

        #firebaseui-auth-container {
            padding: 8px 0;
        }
    }
}
</style>

<style lang="scss">
.firebaseui-page-provider-sign-in {
    background: transparent;
}

p.firebaseui-tospp-full-message {
    color: #eee;

    a.firebaseui-link {
        color: #eee;
    }
}
</style>

<script>
    const {firebase, auth} = require('../firebaseConfig.js')
    import * as firebaseui from '../assets/js/npm__fr';
    import "firebaseui/dist/firebaseui.css";
    
    const ui = new firebaseui.auth.AuthUI(auth);

    export default {
        name: 'login',
        data() {
            return {
                loginFromUrl: null
            }
        },
        components: {
            AppFooter: () => import('./Footer.vue'),
            AppHeader: () => import('./Navigation.vue')
        },
        mounted() {
            if(localStorage) {
                this.loginFromUrl = localStorage.getItem('login-from-url')
            }
            if(firebase.auth().currentUser) {
                this.$router.push('/')
            } else {
                var uiConfig = {
                    signInSuccessUrl: this.loginFromUrl,
                    signInFlow: 'popup',
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
                ui.start('#firebaseui-auth-container', uiConfig)
            }
        }
    }
</script>