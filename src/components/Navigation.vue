<template>
    <div header>
        <header>
            <section top>
                <a title="connexion" @click="login" v-if="!user" login>Connexion</a>
                <div a v-else>
                    <a @click="logout" logout>déconnexion |</a>
                    <span @click="userModalOpen = true">
                        {{ user.displayName || 'Ajouter un nom' }}
                        <md-tooltip md-direction="bottom">Editer mon profil</md-tooltip>
                    </span>
                    <img :src="user.photoURL ? user.photoURL : 'https://i.stack.imgur.com/34AD2.jpg'" :title="'connecté en tant que : ' + user.displayName" alt="photo de profil" pp>
                </div>
                <a href="#" v-if="!notificationsEnabled" @click="requestNotifications" n>| Activer les notifications <i class="material-icons">notification_add</i></a>
                <span href="#" v-if="offline" n>| mode hors ligne <i class="material-icons">airplanemode_active</i></span>
                <router-link to="/articles/submit?ref=navbar_draft_continue" v-if="hasArticleDraft" r>
                    <span>Terminer la rédaction de mon article <i rt class="material-icons">arrow_forward</i></span>
                </router-link>
                <router-link to="/articles/submit?ref=navbar" r v-else>
                    <span><i lt class="material-icons">edit</i> Proposer un article</span>
                </router-link>
            </section>
            <section bottom>
                <button class="button" @click="login" v-if="!user" login-btn>Connexion</button>
                <router-link class="button" @click="login" v-else login-btn to="/articles/submit?ref=navbar_cta">Publier</router-link>
                <router-link to="/?ref=header_logo">
                    <img :src="'/assets/logos/' + (gestion ? 'header_logo_admin.png' : 'header_logo.png')" alt="navbar logo" logo>
                </router-link>
                <ul cat>
                    <li>
                        <router-link to="/?ref=navbar">Accueil</router-link>
                    </li>
                    <li>
                        <router-link to="/magazines?ref=navbar">Magazines</router-link>
                    </li>
                    <md-button class="md-icon-button" @click="showSidepanel = true" menu>
                        <md-icon>menu</md-icon>
                    </md-button>
                </ul>
            </section>
        </header>

        <md-drawer class="md-right" :md-active.sync="showSidepanel">
            <md-list>
                <router-link to="/?ref=drawer">
                    <md-list-item>
                        <md-icon>home</md-icon>
                        <span class="md-list-item-text">Accueil</span>
                    </md-list-item>
                </router-link>
                <router-link to="/magazines?ref=drawer">
                    <md-list-item>
                        <md-icon>luggage</md-icon>
                        <span class="md-list-item-text">Magazines</span>
                    </md-list-item>
                </router-link>
                <router-link to="/articles?ref=drawer">
                    <md-list-item>
                        <md-icon>new_releases</md-icon>
                        <span class="md-list-item-text">Dernières infos</span>
                    </md-list-item>
                </router-link>
                <details v-if="categories">
                    <summary>
                        <md-list-item>
                            <md-icon>expand_more</md-icon>
                            <span class="md-list-item-text">Par thèmes</span>
                        </md-list-item>
                    </summary>
                    <category-label 
                        v-for="(category, index) in categories" v-bind:key="index"
                        :category="category"
                        link-ref="drawer"
                        style="margin-left:56px">
                    </category-label>
                </details>
                <md-list-item v-if="!notificationsEnabled" @click="requestNotifications">
                    <md-icon>notification_add</md-icon>
                    <span class="md-list-item-text">Activer les notifications</span>
                </md-list-item>
            </md-list>
        </md-drawer>

        <user-profile-modal :user="user" :open.sync="userModalOpen"></user-profile-modal>
    </div>
</template>

<style>
[pastille] .md-list-item-content {
    display: block;
}
</style>

<style lang="scss" scoped>
.md-drawer {
    height: 100vh;
    width: 230px;
    position: fixed;
}

[header] {
    position: sticky;
    top: -32px;
    z-index: 2;

    [top] {
        height: 32px;
        background: #17969c;

        [a] {
            font-weight: 300;
            width: fit-content;
            display: inline-flex;
            cursor: pointer;

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

        [n] i {
            font-size: 16px;
            margin-top: 2px;
            margin-left: 4px;
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
        backdrop-filter: saturate(180%) blur(20px);
        background-color: rgba(255,255,255,.72);
        border-bottom: 1px solid rgba(0,0,0,.16);

        [cat] {
            position: absolute;
            right: 32px;
            list-style: none;
            display: inline-block;
            margin: 6px;
            padding: 0;

            [menu] {
                margin: 8px;
                display: none;
            }

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

        [login-btn] {
            height: 48px;
            font-size: 18px;
            font-weight: 500;
            margin: 12px 8px;
        }

        [logo] {
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
}

.transparent {
    [bottom] {
        background: transparent;
        backdrop-filter: none;
        box-shadow: none;
        border-bottom: 1px solid #fff;

        [logo] {
            filter: brightness(0) invert(1);
        }

        [cat] {
            li a, i {
                color: #fff;
            }
        }
    }
}

@media screen and(min-width: 800px) {
    section {
        padding: 0 calc(10vw - 16px);

        [login-btn] {
            display: none;
        }

        [cat] {
            right: 10vw !important;
        }
    }
}

@media screen and(max-width: 800px) {
    [header] {
        top: 0;

        [top] {
            display: none;
        }

        [cat] li, [r] {
            display: none !important;
        }

        [bottom] {
            [logo] {
                position: absolute;
                right: 56px;
                border-right: 1px solid #555;
                padding-right: 8px;
            }

            [cat] {
                right: 0;

                [menu] {
                    display: inline-flex !important;
                }
            }
        }
    }
}
</style>

<script>
const {firebase, db} = require('../firebaseConfig.js')
import { askForPermissioToReceiveNotifications } from '../assets/js/push-notification';

export default {
    props: [
        'transparent',
        'gestion'
    ],
    components: {
        CategoryLabel: () => import('./utils/CategoryLabel'),
        UserProfileModal: () => import('./utils/UserProfile')
    },
    data() {
        return {
            user: this.$root.user,
            hasArticleDraft: localStorage.getItem('submit:draft'),
            showSidepanel: false,
            categories: null,
            notificationsEnabled: false,
            offline: !navigator.onLine,
            userModalOpen: false
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
        },
        fetchCategories() {
            db.collection('categories').get()
            .then(docs => {
                this.categories = []
                docs.forEach(doc => {
                    let buffer = doc.data()
                    buffer.id = doc.id
                    this.categories.push(buffer)
                })
            })
            .catch(err => {
                console.log(err)
            })
        }
    },
    mounted() {
        this.fetchCategories()
        if ('Notification' in window) {
            if(Notification.permission === "granted") {
                this.notificationsEnabled = true
            }
        } else {
            // hide button if navigator don't support notifications
            this.notificationsEnabled = true
        }
    }
}
</script>