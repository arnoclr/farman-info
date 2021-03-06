<template>
    <header>
        <section>
            <div class="col1">
                <h3>Farman</h3>
                <ul class="inline">
                    <li><a @click="logout">Sign Out</a></li>
                </ul>
            </div>
        </section>
    </header>
</template>

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