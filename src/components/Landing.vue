<template>
    <div>
        <app-header class="transparent" transparent></app-header>

        <img alt="Avion sur le tarmac en noir et blanc"
            src="https://i.imgur.com/hrPi8hz.jpg"
            srcset="https://i.imgur.com/vvYf1m0.webp 24w,
                    https://i.imgur.com/hrPi8hzl.webp 640w,
                    https://i.imgur.com/czbTP95.webp 1200w,
                    https://i.imgur.com/WmF4LFX.webp 1600w,
                    https://i.imgur.com/hrPi8hz.webp 2400w">

        <div r>
            <main>
                <h1 a1>Bientôt disponible</h1>

                <p a2>Ce site web n'est pas encore disponible au public. Seule la partie Magazine peut être consultée en cliquant ci-dessous.</p>
                <p npt a2>Farman propose une selection d'informations sur l'aéronautique ainsi qu'une offre de magazines lifestyle, culture & voyages.</p>

                <router-link to="/magazines?ref=cta" class="button" cta a2>Lire le magazine</router-link>

                <div b a3>
                    <span i>S'inscrire à notre newsletter</span>

                    <form @submit.prevent="submit" id="mail-form" class="form-group">
                        <input v-model="mail" type="email" id="mail-input" placeholder="Votre adresse email" required>
                        <button class="icon-button">
                            <md-icon>arrow_forward</md-icon>
                        </button>
                    </form>

                    <md-menu md-direction="top-end" u>
                        <md-button md-menu-trigger class="md-icon-button">
                            <md-icon>more_vert</md-icon>
                        </md-button>

                        <md-menu-content>
                            <a target="_blank" href="https://farman.ga/s/newsletter">
                                <md-menu-item>En savoir plus</md-menu-item>
                            </a>
                            <router-link to="/unsubscribe?ref=landing_page">
                                <md-menu-item>Se désinscrire</md-menu-item>
                            </router-link>
                        </md-menu-content>
                    </md-menu>
                </div>
            </main>

            <span c>
                <a href="https://unsplash.com/@chiabra?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">@Paolo Chiabrando</a>
            </span>
        </div>

        <app-footer f></app-footer>
    </div>
</template>

<style lang="scss" scoped>
img {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    object-fit: cover;
    filter: brightness(0.5);
    transform: scaleX(-1);
}

[r] {
    position: relative;
    height: 85vh;

    main {
        position: absolute;
        max-width: 520px;

        h1 {
            font-size: 56px;
            color: #fff;
        }

        p {
            color: #fff;
            padding-bottom: 16px;
            letter-spacing: 0;

            &[npt] {
                margin-top: -16px;
            }
        }

        [cta] {
            display: inline;
            padding: 12px 16px;
            font-size: 22px;
            background-color: #fff;
            color: #000 !important;
        }

        [b] {
            position: relative;
            margin-top: 32px;
            padding: 32px 16px 16px 16px;
            border: 2px solid #fff;
            border-radius: 8px;

            [i] {
                color: #eee;
                font-size: 24px;
            }

            #mail-form {
                margin-top: 16px;

                input {
                    width: 250px;
                    height: 42px;
                    max-width: 100%;
                    padding-left: 8px;
                    margin-right: 4px;
                    border: 1px solid #fff;
                    color: #fff;

                    &::placeholder {
                        color: #aaa;
                    }

                    &:focus {
                        background-color: rgba(0, 0, 0, 0.6);
                    }
                }

                .icon-button {
                    background-color: transparent;
                    display: contents;

                    i {
                        margin-left: 8px;
                        color: #fff;
                    }
                }
            }

            [u] {
                position: absolute;
                top: 4px;
                right: 4px;

                button i {
                    color: #aaa;
                }
            }
        }

        [a1], [a2], [a3] {
            opacity: 0;
        }

        [a1] {
            animation: fade-in 750ms forwards cubic-bezier(0,.95,.25,.97);
        }

        [a2] {
            animation: fade-in 750ms 0.5s forwards cubic-bezier(0,.95,.25,.97);
        }

        [a3] {
            animation: fade-in 750ms 0.7s forwards cubic-bezier(0,.95,.25,.97);
        }
    }

    [c] {
        position: absolute;
        bottom: 16px;
        right: 16px;
        color: #fff;

        a {
            color: #ddd;
        }

        @media screen and(max-width: 660px) {
            display: none;
        }
    }
}

[f] {
    background-color: #ffffff80;
    position: absolute;
    bottom: -200px;
    width: 100%;

    @media screen and(max-width: 500px) {
        bottom: -30rem;
    }
}

@keyframes fade-in {
    from {
        transform: translateY(-25px);
    }
    
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>

<script>
const {db} = require('../firebaseConfig.js')

export default {
    components: {
        AppFooter: () => import('./Footer.vue'),
        AppHeader: () => import('./Navigation.vue'),
        AppSidebar: () => import('./utils/Sidebar.vue')
    },
    data() {
        return {
            mail: '',
        }
    },
    methods: {
        submit() {
            db.collection('mails').add({
                mail: this.mail
            })
            .then(() => {
                this.mail = ''
                this.$root.$emit('alert', 'Merci ! Vous serez informé lorsque le site sera disponible.')
            })
            .catch(error => {
                console.error('Error adding document: ', error)
                this.$root.$emit('alert', 'Oops, une erreur est survenue.')
            })
        }
    }
}
</script>