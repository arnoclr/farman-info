<template>
    <header>
        <section top>
            <a title="connexion" @click="login" v-if="!user" login>Connexion</a>
            <div a v-else>
                <a @click="logout" logout>déconnexion |</a>
                <span>{{ user.displayName }}</span>
                <img :src="user.photoURL ? user.photoURL : 'https://i.stack.imgur.com/34AD2.jpg'" :title="'connecté en tant que : ' + user.displayName" alt="photo de profil" pp>
            </div>
        </section>
        <section bottom>
            <router-link to="/?ref=header_logo">
                <img :src="'/assets/logos/' + ($route.name == 'admin' ? 'header_logo_admin.png' : transparent ? 'header_logo_blanc.png' : 'header_logo.png')" alt="navbar logo" header>
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
    background: teal;

    [a] {
        font-weight: 300;
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

    span {
        display: inline-flex;
        height: 30px;
        margin: 0;
        color: #fff;
    }

    [pp] {
        height: 16px;
        vertical-align: -15%;
        margin: 0 8px;
        border-radius: 2px;
    }
}

[bottom] {
    height: 72px;
    box-shadow: 0 8px 6px -6px rgba(60, 64, 67, 0.15);
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

        a {
            color: #fff;
        }
    }
}

@media screen and(max-width: 450px) {
    ul {
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
    import firebase from 'firebase'

    export default {
        props: [
            'transparent'
        ],
        data() {
            return {
                user: firebase.auth().currentUser
            }
        },
        methods: {
            login() {
                localStorage.setItem('login-from-url', window.location.href)
                this.$router.push('/login')
            },
            logout() {
                if(confirm('Se déconnecter ?')) {
                    firebase.auth().signOut().then(() =>{
                        this.$router.go()
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }
        }
    }
</script>