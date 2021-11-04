<template>
    <div>
        <div root id="login-background">
            <app-header class="fm-header--transparent" transparent="true"></app-header>

            <main>
                <div id="login">
                    <div class="centered">
                        <h1>Connexion</h1>
                        <p>Connectez-vous à votre espace MyFarman pour commenter et poster des articles.</p>
                    </div>
                    <span class="loc">
                        <md-icon>place</md-icon>
                        Étretat, Seine-Maritime, France
                    </span>
                    <div class="fm-section fm-section--center">
                        <div v-if="showEmailForm" class="fm-card fm-card--shadow" style="width: 360px">
                            <div class="fm-card__body p-32">
                                <div v-if="emailSent">
                                    <svg class="fm-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                        <circle class="fm-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                        <path class="fm-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                    </svg>
                                    <p class="fm-text-small">Nous vous avons envoyé un lien pour vous connecter par email.</p>
                                </div>
                                <div v-else>
                                    <h2>Etape 1</h2>
                                    <p class="fm-text-small">Entrez votre email et nous vous enverrons un lien pour vous connecter. Vous n'avez pas besoin de mot de passe.</p>
                                    <div class="fm-textfield fm-textfield--fullwidth">
                                        <input id="email" type="email" class="fm-textfield__input fm-textfield__input--filled" placeholder=" " v-model="email">
                                        <label class="fm-textfield__label" for="email">Adresse email</label>
                                    </div>
                                    <button class="fm-button" @click="sendLoginWithEmail" :disabled="!isValidEmail || emailSending">Envoyer</button>
                                    <a href="javascript:void(0);" @click="showEmailForm = false" class="fm-link ml-16">retour</a>
                                </div>
                                <div v-if="errorCode">
                                    <p class="fm-error">{{ errorCode }} :</p>
                                    <p class="fm-error">{{ errorMessage }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="fm-section">
                            <button class="fm-button fm-button--large fm-button--shadow" @click="showEmailForm = true">
                                <md-icon class="fm-button__icon fm-button__icon--left">email</md-icon> Email</button>
                            <button class="fm-button fm-button--white fm-button--large fm-button--shadow" @click="loginWithGoogle">
                                <img class="fm-button__icon fm-button__icon--left" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/24px-Google_%22G%22_Logo.svg.png" alt=""> Continuer avec Google</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<style lang="scss" scoped>
[root] {
    // background: url('https://i.imgur.com/4HZI65g.webp');
    background: url('https://i.imgur.com/4HZI65gm.webp');
    background-color: #91AFDE;
    background-size: cover !important;
    background-attachment: fixed !important;
    background-repeat-y: no-repeat !important;
    animation: background-down 1s ease-out;

    #login {
        padding: 16px;
        min-height: calc(100vh - 120px);
        display: grid;
        justify-content: center;
        position: relative;

        .centered {
            text-align: center;
            max-width: 380px;

            h1, p {
                color: #fff;
            }
        }

        .loc {
            position: fixed;
            bottom: 16px;
            left: 10vw;
            color: #fff;

            i {
                color: #fff;
            }
        }

        @media screen and(max-width: 600px) {
            .loc {
                display: none;
            }
        }

        #firebaseui-auth-container {
            padding: 8px 0;
        }
    }
}

@keyframes background-down {
    0% {
        background-position-y: 105px;
    }
    25% {
        background-position-y: 105px;
    }
    100% {
        background-position-y: 0;
    }
}
</style>

<script>
import { analyticsInstance, auth } from '../firebaseConfig'
import { logEvent } from 'firebase/analytics'
import { GoogleAuthProvider, signInWithPopup, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'

export default {
    name: 'login',
    data() {
        return {
            loginFromUrl: null,
            user: this.$root.user,
            showEmailForm: false,
            email: '',
            emailSent: false,
            emailSending: false,
            errorMessage: null,
            errorCode: null
        }
    },
    metaInfo: {
        title: 'Connexion à Farman'
    },
    components: {
        AppFooter: () => import('./Footer.vue'),
        AppHeader: () => import('./Navigation.vue')
    },
    computed: {
        isValidEmail: function() {
            return this.email.match(/.+@[a-z0-9-]+\.[a-z]{2,5}/g)
        },
    },
    methods: {
        loginWithGoogle() {
            const provider = new GoogleAuthProvider()

            signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
        },
        sendLoginWithEmail() {
            this.emailSending = true
            this.errorCode = null
            this.errorMessage = null

            const actionCodeSettings = {
                // URL you want to redirect back to. The domain (www.example.com) for this
                // URL must be in the authorized domains list in the Firebase Console.
                url: window.location.href,
                // This must be true.
                handleCodeInApp: true,
                dynamicLinkDomain: 'farman.ga'
            }

            sendSignInLinkToEmail(auth, this.email, actionCodeSettings)
            .then(() => {
                // The link was successfully sent. Inform the user.
                // Save the email locally so you don't need to ask the user for it again
                // if they open the link on the same device.
                window.localStorage.setItem('emailForSignIn', this.email);
                this.emailSent = true
                this.emailSending = false
            })
            .catch((error) => {
                this.errorCode = error.code;
                this.errorMessage = error.message;
                this.emailSending = false
            })
        },
        verifyLoginWithEmail() {
            if (isSignInWithEmailLink(auth, window.location.href)) {
                // Additional state parameters can also be passed via URL.
                // This can be used to continue the user's intended action before triggering
                // the sign-in operation.
                // Get the email if available. This should be available if the user completes
                // the flow on the same device where they started it.
                let email = window.localStorage.getItem('emailForSignIn');
                if (!email) {
                    // User opened the link on a different device. To prevent session fixation
                    // attacks, ask the user to provide the associated email again. For example:
                    email = window.prompt('Please provide your email for confirmation');
                }
                // The client SDK will parse the code from the link for you.
                signInWithEmailLink(auth, email, window.location.href)
                .then((result) => {
                // Clear email from storage.
                window.localStorage.removeItem('emailForSignIn');
                // You can access the new user via result.user
                // Additional user info profile not available via:
                // result.additionalUserInfo.profile == null
                // You can check if the user is new or existing:
                // result.additionalUserInfo.isNewUser
                })
                .catch((error) => {
                // Some error occurred, you can inspect the code: error.code
                // Common errors could be invalid email and invalid or expired OTPs.
                });
            }
        },
        exitLoginPage() {
            this.$router.push(this.loginFromUrl)
            logEvent(analyticsInstance, 'login', {
                ref: window.ref
            })
        }
    },
    mounted() {
        if(localStorage) {
            this.loginFromUrl = localStorage.getItem('login-from-url')
            let path = this.loginFromUrl.split('?')[0]
            this.loginFromUrl
            this.$root.$emit('toast', 'Vous serez redirigé vers ' + path)
        }
        if(this.user) return this.exitLoginPage()

        // image loading
        let downloadingImage = new Image()
        let imageSrc = 'https://i.imgur.com/4HZI65g.webp'
        downloadingImage.onload = () => {
            document.getElementById('login-background').style.background = `url('${imageSrc}')`  
        }
        downloadingImage.src = imageSrc

        // if coming from a signin link
        let params = (new URL(window.location.href)).searchParams;
        if(params.get('oobCode')) this.verifyLoginWithEmail()
    }
}
</script>