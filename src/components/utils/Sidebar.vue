<template>
    <aside>
        <div a>
            <div v-for="(ad, index) in sidebarBanners" :key="index">
                <a :href="utmify(ad.link)">
                    <img :src="ad.image" alt="magazine publicité">
                </a>
            </div>
        </div>
    </aside>
</template>

<style lang="scss" scoped>
aside {
    position: relative;

    [a] {
        position: sticky;
        top: 50px;

        img {
            width: 100%;
            height: auto;
            margin-bottom: 8px;
            border: 1px solid #888;
            object-fit: cover;
        }
    }
}
</style>

<script>
import {remoteConfig} from '../../firebaseConfig'

export default {
    data() {
        return {
            sidebarBanners: JSON.parse(remoteConfig.getString('sidebar_banners'))
        }
    },
    methods: {
        utmify(url) {
            let utm = 'utm_source=farman&utm_medium=banner&utm_campaign=internal_ad'
            return url += url.includes('?') ? '&' + utm : '?' + utm
        }
    },
    mounted() {
        remoteConfig.fetchAndActivate()
            .then(() => {
                this.sidebarBanners = JSON.parse(remoteConfig.getString('sidebar_banners'))
            })
            .catch((err) => { console.error(err) })
    }
}
</script>