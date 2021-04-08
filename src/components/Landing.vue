<template>
    <div>
        <app-header class="transparent" transparent></app-header>

        <img alt="Airbus Airfrance Aéroport de Nice"
            src="https://i.imgur.com/hrPi8hz.webp"
            srcset="https://i.imgur.com/hrPi8hzl.webp 640w,
                    https://i.imgur.com/czbTP95.webp 1200w,
                    https://i.imgur.com/hrPi8hz.webp 4032w">

        <div r>
            <main>
                <h1>Bientôt disponible</h1>
                <p>Ce site web n'est pas encore disponible au public. 
                    <br>Seule la partie Magazine peut être consultée en cliquant ci-dessous.</p>

                <router-link to="/magazines?ref=cta" class="button" cta>Lire le magazine</router-link>

                <div b>
                    <span i>S'inscrire à notre newsletter</span>

                    <form @submit.prevent="submit" id="mail-form" class="form-group">
                        <input v-model="mail" type="email" id="mail-input" placeholder="Votre adresse email" required>
                        <button class="icon-button">
                            <md-icon>arrow_forward</md-icon>
                        </button>
                    </form>
                </div>
            </main>

            <span c>
                Photo par <a href="https://unsplash.com/@chiabra?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Paolo Chiabrando</a> via <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
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
}

[r] {
    position: relative;
    height: 85vh;

    main {
        position: absolute;

        h1 {
            font-size: 56px;
            color: #fff;
        }

        p {
            color: #fff;
            padding-bottom: 16px;
        }

        [cta] {
            display: inline;
            padding: 12px 16px;
            font-size: 22px;
            background-color: #fff;
            color: #000 !important;
        }

        [b] {
            margin-top: 32px;
            padding: 32px 16px;
            border: 2px solid #fff;
            border-radius: 8px;

            [i] {
                color: #eee;
                font-size: 24px;
            }

            #mail-form {
                margin-top: 8px;

                input {
                    width: 250px;
                    height: 42px;
                    max-width: 100%;
                    padding-left: 8px;
                    margin-right: 4px;
                    border: 1px solid #fff;
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
    }
}

[f] {
    background-color: #fff;
    position: absolute;
    bottom: -200px;
    width: 100%;
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