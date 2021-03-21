<template>
    <div class="no-padding">
        <footer>
            <div a>
                <hr>
                <h2>Retrouvez-nous sur <i class="material-icons">arrow_forward</i></h2>
                <p b>Toute l'actualité aérienne française à découvrir sur vos réseaux sociaux.</p>
                <div class="social-links">
                    <a href="https://www.facebook.com/Farman-104565121316470" title="Page Facebook">
                        <img src="/assets/icons/Farman_Facebook.png" alt="facebook icon" height="24">
                    </a>
                    <a href="https://twitter.com/ActualitsArona1" title="Page Twitter">
                        <img src="/assets/icons/Farman_Twitter.png" alt="twitter icon" height="24">
                    </a>
                    <a href="https://www.instagram.com/farman.info/" title="Page Instagram">
                        <img src="/assets/icons/Farman_Instagram.png" alt="instagram icon" height="24">
                    </a>
                    <a href="https://www.youtube.com/channel/UC9oYwEaRK3Bv68G-bKe-l_Q" title="Chaine Youtube">
                        <img src="/assets/icons/Farman_YouTube.png" alt="youtube icon" height="24">
                    </a>
                </div>
            </div>
            <div class="links">
                <p></p>
                <p><router-link to="/?ref=footer_copyright">©{{ new Date().getFullYear() }} Farman</router-link></p>
                <p><a href="https://farman.ga/s/cgu">Informations juridiques</a></p>
                <p></p>
            </div>
        </footer>
    </div>
</template>

<style lang="scss" scoped>
footer {
    position: relative;

    [a] {
        padding: 16px;
        color: #444;
    }

    p {
        line-height: 20px;
        font-size: 16px;
    }

    i {
        vertical-align: -25%;
        color: teal;
    }

    img {
        height: 36px;
        margin-right: 8px;
    }

    .links {
        display: flex;
        justify-content: space-evenly;
        background-color: #ccc;
        
        a {
            text-decoration: none;
            color: #444;
            font-size: 16px;
        }

        p {
            margin: 8px 0;
        }
    }
}

@media (min-width: 600px) {
    .social-links {
        position: absolute;
        right: 32px;
        margin-top: -50px;

        img {
            height: 28px;
            margin-right: 16px;
        }
    }

    [b] {
        margin-right: 180px;
    }

    footer [a] {
        padding-left: 32px;
        padding-right: 32px;
    }
}
</style>

<script>
export default {
    
}
</script>