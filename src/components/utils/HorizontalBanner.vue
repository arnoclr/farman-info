<template>
    <div class="fm-horizontal-banners" ref="scroller" v-if="banners.length > 0">
        <div class="fm-horizontal-banners__slide" v-for="(banner, index) in banners" :key="index">
            <a :href="referencer(banner.link)" :disabled="!banner.link">
                <img :src="smallDevice ? banner.image_small : banner.image" alt="">
            </a>
        </div>
        <div class="fm-horizontal-banners__progress">
            <div class="fm-horizontal-banners__progress-bar" ref="bar"></div>
        </div>
    </div>
</template>

<script>
import {remoteConfig} from './../../firebaseConfig'

export default {
    data() {
        return {
            banners: [],
            interval: null,
            scrollEnd: false,
            smallDevice: window.innerWidth < 750
        }
    },
    methods: {
        referencer(url) {
            if(url == undefined) return
            let ref = 'ref=horizontal_banner'
            return url += url.includes('?') ? '&' + ref : '?' + ref
        },
        nextSlide() {
            this.calculScroll()
            const left = this.scrollEnd
                ? 0
                : this.$refs.scroller.scrollLeft + window.innerWidth
            this.$refs.scroller.scrollTo({left, behavior: 'smooth'})
        },
        calculScroll() {
            const w = this.$refs.scroller.scrollWidth
            const s = this.$refs.scroller.scrollLeft
            const ow = this.$refs.scroller.offsetWidth
            this.scrollEnd = (w-s) <= ow + 100
        }
    },
    async mounted() {
        await remoteConfig.fetchAndActivate()
        const banners = JSON.parse(remoteConfig.getString('main_horizontal_banners'))
        banners.forEach(banner => {
            this.banners.push(banner)
        })
        this.$nextTick(function () {
            if(this.banners.length < 2) return
            this.$refs.bar.classList.add('js-animated')
            this.interval = setInterval(this.nextSlide, 8000)
        })
    },
    beforeDestroy() {
        clearInterval(this.interval)
        this.$refs.bar.classList.remove('js-animated')
    }
}
</script>