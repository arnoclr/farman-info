<template>
    <div>
        <footer>
            <div style="padding:16px;color:#444">
                <hr>
                <h4>Retrouvez-nous sur <i class="material-icons">arrow_forward</i></h4>
                <p>Toute l'actualité aérienne française <br>à découvrir sur vos réseaux sociaux.</p>
                <a href="https://www.facebook.com/Farman-104565121316470">
                    <img src="assets/Farman_Facebook.png" alt="facebook icon" height="24">
                </a>
                <a href="https://twitter.com/ActualitsArona1">
                    <img src="assets/Farman_Twitter.png" alt="twitter icon" height="24">
                </a>
                <a href="https://www.instagram.com/farman.media/">
                    <img src="assets/Farman_Instagram.png" alt="instagram icon" height="24">
                </a>
                <a href="https://www.youtube.com/channel/UC9oYwEaRK3Bv68G-bKe-l_Q">
                    <img src="assets/Farman_YouTube.png" alt="youtube icon" height="24">
                </a>
            </div>
            <div style="text-align:center;background-color:#ccc;padding:8px 16px;color:#444">
                <p>©2020 Farman &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style="text-decoration:none;color:#444" href="/assets/Farman_Informations_Juridiques_13-12-2020.pdf">Informations juridiques</a></p>
            </div>
        </footer>
    </div>
</template>

<style scoped>
    footer i.material-icons {
        vertical-align: -25%;
    }

    footer img {
        margin-right: 4px;
    }

    @media (min-width: 992px) {
        footer h4 {
            margin-top: 0;
            font-size: 1.8rem !important;
        }
        footer>div:first-child p {
            font-size: 1.5rem;
        }
        footer img {
            height: 48px !important;
            margin-right: 8px;
        }
    }
</style>

<script>
export default {
    
}
</script>