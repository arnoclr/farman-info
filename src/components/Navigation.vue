<template>
    <header>
        <router-link to="/">
            <img src="/assets/header_logo.png" alt="navbar logo" header>
        </router-link>
        <section class="right">
            <a title="connexion" @click="login" class="button" v-if="!user">Connexion</a>
            <div v-else>
                <img :src="user.photoURL ? user.photoURL : 'https://i.stack.imgur.com/34AD2.jpg'" :title="'connecté en tant que : ' + user.displayName" alt="photo de profil" pp>
                <a @click="logout" class="button-outlined">déconnexion</a>
            </div>
        </section>

        <cookie-law button-text="Accepter" button-class="button" :button-decline="true" button-decline-text="Tout refuser" button-decline-class="button-outlined">
            <div slot="message">
                Ce site web utilise des cookies <a href="https://farman.ga/s/cgu">Informations complémentaires</a>
            </div>
        </cookie-law>
    </header>
</template>

<style scoped>
header {
    height: 72px;
    box-shadow: 0 8px 6px -6px rgb(60 64 67 / 15%);
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 2;
}

section.right {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    height: 72px;
    display: flex;
    align-items: center;
}

.button {
    margin: 8px;
    color: grey;
    font-size: 12px;
}

[header] {
    height: 42px;
    margin-left: 32px;
    margin-top: 15px;
}

[pp] {
    width: 42px;
    margin-right: 16px;
    margin-top: -4px;
    border-radius: 50%;
    vertical-align: middle;
}

.Cookie {
    background: #fff;
}

.Cookie .button-outlined {
    margin: 0 !important;
}
</style>

<script>
    import firebase from 'firebase'
    import CookieLaw from 'vue-cookie-law'

    export default {
        components: {
            CookieLaw
        },
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
                firebase.auth().signOut().then(() =>{
                    this.$router.go()
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>