<template>
    <div a>
        <span>404</span>
        <h1>Page non trouvée</h1>

        <div l>
            <router-link :to="{name: 'LandingPage', params: {ref: '404'}}">Page d'accueil</router-link>
            <router-link :to="{name: 'Magazines', params: {ref: '404'}}">Nos magazines</router-link>
            <router-link :to="{name: 'articleList', params: {ref: '404'}}">Derniers articles</router-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>
[a] {
    padding: 32px;
    height: 100vh;
    width: 100vw;
    background-color: #000;

    span {
        color: #eee;
        font-size: 26px;
    }

    h1 {
        margin-top: -32px;
        color: #fff;
        border-bottom: 2px solid #fff;
        letter-spacing: -18px;
        animation: letters .5s cubic-bezier(.36,.28,.06,.99) forwards,
            slide .3s ease .7s forwards,
            border .3s ease .9s forwards;
    }

    [l] {
        a {
            display: block;
            position: relative;
            font-size: 26px;
            font-weight: 500;
            color: #fff;
            margin: 16px 0;
            transition: transform .3s cubic-bezier(0,.95,.25,.97);

            &::before {
                content: 'arrow_forward';
                font-family: 'Material Icons Sharp';
                position: absolute;
                left: -24px;
                top: 0;
                opacity: 0;
                transition: opacity .2s;
            }

            &:hover {
                transform: translateX(24px);
                opacity: 1 !important;

                &::before {
                    opacity: 1;
                }
            }
        }

        &:hover {
            a {
                opacity: .6;
            }
        }
    }

    [c] {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        color: #fff;
    }
}

@keyframes letters {
    to {
        letter-spacing: -2px;
    }
}

@keyframes slide {
    to {
        margin-top: 0;
    }
}

@keyframes border {
    to {
        padding-bottom: 32px;
    }
}
</style>

<script>
export default {
    
}
</script>