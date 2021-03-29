<template>
    <header>
        <section top>
            <a title="connexion" @click="login" v-if="!user" login>Connexion</a>
            <div a v-else>
                <a @click="logout" logout>déconnexion |</a>
                <span>{{ user.displayName }}</span>
                <img :src="user.photoURL ? user.photoURL : 'https://i.stack.imgur.com/34AD2.jpg'" :title="'connecté en tant que : ' + user.displayName" alt="photo de profil" pp>
            </div>
            <a href="#" @click="requestNotifications" n>| Activer les notifications</a>
            <router-link to="/articles/submit?ref=navbar_draft_continue" v-if="hasArticleDraft" r>
                <span>Terminer la rédaction de mon article <i rt class="material-icons">arrow_forward</i></span>
            </router-link>
            <router-link to="/articles/submit?ref=navbar" r v-else>
                <span><i lt class="material-icons">edit</i> Proposer un article</span>
            </router-link>
        </section>
        <section bottom>
            <router-link to="/?ref=header_logo">
                <img :src="'/assets/logos/' + (gestion ? 'header_logo_admin.png' : 'header_logo.png')" alt="navbar logo" header>
            </router-link>
            <ul>
                <li>
                    <router-link to="/?ref=navbar">Accueil</router-link>
                </li>
                <li>
                    <router-link to="/magazines?ref=navbar">Magazines</router-link>
                </li>
            </ul>
        </section>
    </header>
</template>

<style lang="scss" scoped>
header {
    position: sticky;
    top: -32px;
    z-index: 2;
}

[top] {
    height: 32px;
    background: #17969c;

    [a] {
        font-weight: 300;
        width: fit-content;
        display: inline-flex;

        span {
            margin-top: 5px;
        }
    }

    [login], [logout] {
        display: inline-flex;
        align-items: center;
        padding: 8px;
        height: 30px;
        width: fit-content;
        color: #fff;
        cursor: pointer;

        &:hover {
            color: #eee;
            text-decoration: underline;
        }
    }

    [r] {
        float: right;
        margin-right: 32px;
        transition: transform 150ms ease-out;
        
        span {
            padding-top: 6px;

            i {
                font-size: 18px;
                
                &[lt] {
                    margin-right: 8px;
                }

                &[rt] {
                    margin-left: 8px;
                }
            }
        }

        &:hover {
            transform: translateX(16px);
        }
    }

    span, [n] {
        display: inline-flex;
        height: 30px;
        margin: 0;
        color: #fff;

        &:hover {
            color: #eee;
        }
    }

    [pp] {
        height: 16px;
        vertical-align: -15%;
        margin: 8px;
        border-radius: 2px;
    }
}

[bottom] {
    height: 72px;
    box-shadow: 0 9px 10px 0 rgba(34, 34, 34, 0.1);
    background: #fff;

    ul {
        position: absolute;
        right: 32px;
        list-style: none;
        display: inline-block;
        margin: 6px;
        padding: 0;

        li {
            display: inline-flex;
            position: relative;
            margin-left: 8px;
            height: 60px;
            border-radius: 4px;

            &::before {
                content: ' ';
                display: block;
                background: #ccc;
                height: 20px;
                width: 1px;
                margin-top: 20px;
                position: absolute;
                left: -4px;
            }

            &:first-child::before {
                opacity: 0;
            }

            &:hover {
                background: rgba(150, 150, 150, 0.2);
            }

            a {
                text-decoration: none;
                color: #444;
                display: flex;
                align-items: center;
                padding: 0 8px;
            }
        }
    }

    .button {
        margin: 8px;
        color: grey;
        font-size: 12px;
    }

    [header] {
        display: inline-block;
        height: 42px;
        margin-left: 16px;
        margin-top: 15px;
    }

    [pp] {
        width: 42px;
        margin-right: 16px;
        margin-top: -4px;
        border-radius: 50%;
        vertical-align: middle;
    }
}

.transparent {
    [bottom] {
        background: transparent;
        box-shadow: none;
        border-bottom: 1px solid #fff;

        [header] {
            filter: brightness(0) invert(1);
        }

        a {
            color: #fff;
        }
    }
}

@media screen and(max-width: 450px) {
    ul, [r] {
        display: none !important;
    }
}

@media screen and(min-width: 600px) {
    section {
        padding: 0 16px;
    }
}
</style>

<script>
const {firebase} = require('../firebaseConfig.js')
import { askForPermissioToReceiveNotifications } from '../assets/js/push-notification';

export default {
    props: [
        'transparent',
        'gestion'
    ],
    data() {
        return {
            user: this.$root.user,
            hasArticleDraft: localStorage.getItem('submit:draft')
        }
    },
    methods: {
        login() {
            localStorage.setItem('login-from-url', window.location.href)
            this.$router.push('/login?ref=navbar')
        },
        logout() {
            if(confirm('Se déconnecter ?')) {
                firebase.auth().signOut().then(() => {
                    this.$router.go()
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        requestNotifications() {
            askForPermissioToReceiveNotifications()
        }
    }
}
</script>