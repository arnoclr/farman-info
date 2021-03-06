<template>
    <div>
        <div style="position:relative;">

            <img  style="width:100%;height:80vh;object-fit:cover;"
                src="assets/Farman_Photo_Fond_Prochainement.webp" 
                alt="Farman photo fond prochainement">

            <div style="position:absolute;top:0;color:#fff;padding:32px;">
                <img  style="height:75px;width:auto" id="logo-header"
                        src="assets/Logo_Blanc_PNG.png" alt="logo header">
                <p style="font-size:1.5rem;margin-top:0" id="first-p">Le média aéronautique<br>des voyageurs francophones</p>
            </div>

            <div style="position:absolute;top:50vh;text-align:center;width:100%;color:#fff;">
                <h1 style="margin-bottom:0;font-size:3rem;font-weight:400;">Prochainement</h1>
                <h4 style="margin-top:0;font-weight:300;">SITE INTERNET D'INFORMATION</h4>
            </div>

        </div>

        <form id="mail-form" style="position:absolute;top:30vh;padding:32px;">
            <input  type="email" id="mail-input" placeholder="Votre adresse email"
                    style="padding:8px">
            <br>
            <button style="background-color:#17969C;padding:12px;color:#fff;border:none;font-weight:100;">Me tenir informé</button>
        </form>

        <app-footer></app-footer>
    </div>
</template>

<style scoped>
    body {
        font-family: 'Roboto', sans-serif;
    }
    @media (min-width: 992px) {
        input {
            width: 300px;
        }
        button {
            padding: 16px !important;
        }
        #logo-header {
            height: 125px !important;
        }
        form {
            margin-top: 50px;
        }
        h1 {
            font-size: 5rem !important;
        }
        #first-p {
            font-size: 2rem !important;
            font-weight: 500 !important;
        }
    }
</style>

<script>
    const {db} = require('../firebaseConfig.js')
    import AppFooter from '../components/Footer.vue'

    export default {
        components: {
            AppFooter
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