<template>
    <div>
        <app-header></app-header>

        <div class="work-zone">
            <svg viewBox="0 0 24 24">
                <path fill="" d="M17 15L18 19H21V22H3V19H6L7 15H17M15 8L16 12H8L9 8H15M13 1L14 5H10L11 1H13Z" />
            </svg>
            <h1>Site en cours de développement</h1>
            <p>Ce site web n'est pas encore disponible au public.</p>
            <p>Seule la partie Magazine peut être consultée en cliquant ci-dessous</p>
            <router-link class="btn" to="/magazines">Consulter les magazines</router-link>

            <form id="mail-form">
                <p>Soyez informé quand le site sera entierement disponible, et recevez des informations sur son dévelopement par mail.</p>
                <input type="email" id="mail-input" placeholder="Votre adresse email">
                <button>Me tenir informé</button>
            </form>
        </div>

        <app-footer></app-footer>
    </div>
</template>

<style scoped>
.work-zone {
    padding: 16px;
    color: #555;
}

svg {
    width: 56px;
    height: 56px;
    fill: #555;
}

#mail-form {
    background: #ddd;
    padding: 32px 16px;
    margin-top: 32px;
}

#mail-form p {
    margin-top: 0;
}

input {
    width: 250px;
    height: 40px;
    max-width: 100%;
    padding-left: 8px;
}
</style>

<script>
const {db} = require('../firebaseConfig.js')

export default {
    components: {
        AppFooter: () => import('./Footer.vue'),
        AppHeader: () => import('./Navigation.vue')
    },
    mounted() {
        const mailForm = document.querySelector('#mail-form')
        const mailInput = document.querySelector('#mail-input')

        mailForm.addEventListener('submit', (e) => {
            e.preventDefault()
            db.collection('mails').add({
                mail: mailInput.value
            })
            .then(function (docRef) {
                console.log('Document written with ID: ', docRef.id)
                mailInput.value = ''
                alert('Merci ! Vous serez informé lorsque le site sera disponible.')
            })
            .catch(function (error) {
                console.error('Error adding document: ', error)
                alert('Oops, une erreur est survenue.')
            })
        })
    }
}
</script>