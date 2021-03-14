<template>
    <div>
        <footer>
            <div style="padding:16px;color:#444">
                <hr>
                <h4>Retrouvez-nous sur <i class="material-icons">arrow_forward</i></h4>
                <p>Toute l'actualité aérienne française <br>à découvrir sur vos réseaux sociaux.</p>
                <div class="social-links">
                    <a href="https://www.facebook.com/Farman-104565121316470">
                        <img src="/assets/Farman_Facebook.png" alt="facebook icon" height="24">
                    </a>
                    <a href="https://twitter.com/ActualitsArona1">
                        <img src="/assets/Farman_Twitter.png" alt="twitter icon" height="24">
                    </a>
                    <a href="https://www.instagram.com/farman.media/">
                        <img src="/assets/Farman_Instagram.png" alt="instagram icon" height="24">
                    </a>
                    <a href="https://www.youtube.com/channel/UC9oYwEaRK3Bv68G-bKe-l_Q">
                        <img src="/assets/Farman_YouTube.png" alt="youtube icon" height="24">
                    </a>
                </div>
            </div>
            <div class="links">
                <p></p>
                <p>©2020 Farman</p>
                <p><a style="text-decoration:none;color:#444" href="https://farman.ga/s/cgu">Informations juridiques</a></p>
                <p></p>
            </div>
        </footer>
    </div>
</template>

<style scoped>
    footer {
        position: relative;
    }

    footer i.material-icons {
        vertical-align: -25%;
    }

    footer img {
        height: 36px;
        margin-right: 8px;
    }

    .links {
        display: flex;
        justify-content: space-evenly;
        background-color: #ccc;
        padding: 8px 16px;
        color: #444;
    }

    @media (min-width: 600px) {
        .social-links {
            position: absolute;
            right: 16px;
            top: 92px;
        }
    }
</style>

<script>
export default {
    
}
</script>