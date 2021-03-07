<template>
    <header>
        <router-link to="/">
            <img src="/assets/header_logo.png" alt="navbar logo">
        </router-link>
        <section class="right">
            <router-link title="connexion" to="/login" class="icon-button"><i class="material-icons">login</i></router-link>
        </section>
    </header>
</template>

<style scoped>
header {
    height: 64px;
    box-shadow: 0 8px 6px -6px rgb(60 64 67 / 15%);
    position: sticky;
    top: 0;
    background: #fff;
}

section.right {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
}

.icon-button {
    margin: 8px;
    color: grey;
}

img {
    height: 48px;
    margin: 8px 12px;
}
</style>

<script>
    import firebase from 'firebase'

    export default {
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