<template>
    <aside>
        <div a>
            <router-link :to="sidebarBannerLink">
                <img :src="sidebarBanner" alt="magazine publicité">
            </router-link>
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
            border: 1px solid #888;
            object-fit: cover;
            aspect-ratio: 0.54;
        }
    }
}
</style>

<script>
import {remoteConfig} from '../../firebaseConfig'

export default {
    data() {
        return {
            sidebarBanner: remoteConfig.getString('sidebar_banner'),
            sidebarBannerLink: remoteConfig.getString('sidebar_banner_link')
        }
    },
    mounted() {
        remoteConfig.fetchAndActivate()
            .then(() => {
                this.sidebarBanner = remoteConfig.getString('sidebar_banner')
                this.sidebarBannerLink = remoteConfig.getString('sidebar_banner_link')
            })
            .catch((err) => { console.error(err) })
    }
}
</script>