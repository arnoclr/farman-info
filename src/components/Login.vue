<template>
    <div class="fm-login">
        <div class="fm-section fm-section--center">
            <div class="fm-card fm-card--white fm-card--shadow fm-login__card" style="width: 360px">
                <div class="fm-card__body fm-login__card-body">
                    <div class="fm-login__card-header">
                        <img class="fm-login__logo" src="/assets/logos/header_logo.png" alt="Logo Farman">
                        <h2>Connexion</h2>
                    </div>

                    <div v-if="showEmailForm" class="fm-login__card-form">
                        <div v-if="emailSent">
                            <svg class="fm-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle class="fm-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                <path class="fm-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>
                            <p class="fm-text-small">Nous vous avons envoyé un lien pour vous connecter par email.</p>
                        </div>
                        <div v-else>
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

                    <div v-else class="fm-section">
                        <ul class="fm-options pb-32">
                            <li class="fm-options__action" @click="showEmailForm = true">
                                <div class="fm-options__action-icon">email</div>
                                <span class="fm-options__action-label">Me connecter avec mon adresse email</span>
                            </li>
                            <li class="fm-options__action" @click="loginWithGoogle">
                                <div class="fm-options__action-icon">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/24px-Google_%22G%22_Logo.svg.png" alt="Logo Google">
                                </div>
                                <span class="fm-options__action-label">Continuer avec Google</span>
                            </li>
                            <router-link :to="{ name: 'aboutAccount', params: { ref: 'login_page' } }">
                                <li class="fm-options__action">
                                    <div class="fm-options__action-icon">arrow_forward</div>
                                    <span class="fm-options__action-label">Découvrir les avantages</span>
                                </li>
                            </router-link>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <a href="https://farman.ga/s/cgu" class="fm-link fm-login__link">Conditions d'utilisation</a>
    </div>
</template>

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
                window.location.reload()
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

                    // TODO: interface to ask for email
                    email = window.prompt("Nous avons besoin d'une vérification supplémentaire, renseignez à nouveau votre mail :");
                }
                // The client SDK will parse the code from the link for you.
                signInWithEmailLink(auth, email, window.location.href)
                .then((result) => {
                    // Clear email from storage.
                    window.localStorage.removeItem('emailForSignIn');
                    window.location.reload()
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

        // if coming from a signin link
        let params = (new URL(window.location.href)).searchParams;
        if(params.get('oobCode')) this.verifyLoginWithEmail()
    }
}
</script>