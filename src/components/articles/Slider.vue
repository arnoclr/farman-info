<template>
    <div ref="slider"
    class="fm-section fm-section--scrollable fm-section--hide-scrollbar fm-section--scrollable-snap-scroll">
        <router-link
        draggable="false"
        class="item" style="text-decoration: none"
        :to="{name: 'articleView', params: {id: article.id, ref: 'slider_' + ga_ref}}"
        v-for="(article, index) in articles" :key="index">
            <div class="fm-card fm-card--img fm-card--medium">
                <div class="fm-card__img">
                    <img :src="article.thumbnail" :alt="article.title">
                </div>
                <div class="fm-card__body">
                    <h1 class="fm-card__body-title">{{ article.title }}</h1>
                    <div class="fm-card__body-content">
                        <p>{{ article.summary }}</p>
                    </div>
                </div>
            </div>
        </router-link>
        <div class="fm-section__fixed-start">
            <button
                @click="scrollLeft"
                :hidden="scrollStart"
                class="fm-button fm-button--square fm-button--fab">
                <i class="material-icons">arrow_backward</i>
            </button>
        </div>
        <div class="fm-section__fixed-end">
            <button
                @click="scrollRight"
                class="fm-button fm-button--square fm-button--fab">
                <i class="material-icons fm-morphing-icon"
                    style="transform: rotate(-45deg) scale(1.6)"
                    :morphed="!scrollEnd">arrow_forward</i>
                <i class="material-icons fm-morphing-icon"
                    style="transform: rotate(45deg) scale(0.6)"
                    :morphed="scrollEnd">launch</i>
            </button>
        </div>
    </div>
</template>

<script>
const CARD_WIDTH = 350

export default {
    props: ['articles', 'ga_ref', 'button_link'],
    data() {
        return {
            scrollEnd: false,
            scrollStart: true
        }
    },
    methods: {
        scrollLeft() {
            this.$refs.slider.scrollTo({
                left: this.$refs.slider.scrollLeft - CARD_WIDTH,
                behavior: 'smooth'
            })
        },
        scrollRight() {
            if(this.scrollEnd)
                return this.$router.push(this.button_link)
            this.$refs.slider.scrollTo({
                left: this.$refs.slider.scrollLeft + CARD_WIDTH,
                behavior: 'smooth'
            })
        },
        calculScroll() {
            const w = this.$refs.slider.scrollWidth
            const s = this.$refs.slider.scrollLeft
            const ow = this.$refs.slider.offsetWidth
            this.scrollEnd = (w-s) <= ow + 100
            this.scrollStart = s == 0
        }
    },
    mounted() {
        this.calculScroll()
        this.$refs.slider.addEventListener('scroll', this.calculScroll)
    },
    beforeDestroy() {
        this.$refs.slider.removeEventListener('scroll', this.calculScroll)
    }
}
</script>