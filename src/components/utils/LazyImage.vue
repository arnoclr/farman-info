<template>
    <img loading="lazy" :src="actualSrc" :alt="alt">
</template>

<script>
export default {
    props: ['src', 'blurSrc', 'alt'],
    data() {
        return {
            actualSrc: null
        }
    },
    mounted() {
        this.actualSrc = this.blurSrc
        let downloadingImage = new Image()
        downloadingImage.onload = () => {
            this.actualSrc = this.src
        }
        downloadingImage.src = this.src
    }
}
</script>