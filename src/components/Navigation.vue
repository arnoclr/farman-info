<template>
    <header>
        <router-link to="/">
            <img src="/assets/header_logo.png" alt="navbar logo">
        </router-link>
        <section class="right">
            <router-link title="connexion" to="/login" class="button" v-if="!isLogged">Connexion</router-link>
            <a href="" class="button-outlined" v-else>déconnexion</a>
        </section>
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

img {
    height: 42px;
    margin-left: 32px;
    margin-top: 15px;
}
</style>

<script>
    import firebase from 'firebase'

    export default {
        data() {
            return {
                isLogged: firebase.auth().currentUser
            }
        },
        methods: {
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