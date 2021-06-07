const body = document.getElementById('body')

export const bottomSheatMixin = {
    props: ['open'],
    data() {
        return {
            scrollState: 0,
            scrollOffset: 0,
            isSwiping: false,
        }
    },
    watch: {
        open: function (newVal, oldVal) {
            if(newVal === true) {
                this.scrollState = window.scrollY
                body.style.overflow = 'hidden'
            }
        }
    },
    methods: {
        closeModal() {
            this.$emit('update:open', false)
            this.resetSwipe()
            setTimeout(() => {
                body.style.removeProperty('overflow')
            }, 250);
        },
        startSwipe(e) {
            this.scrollState = e.clientY || e.touches[0].clientY
        },
        swipe(e) {
            const scroll = e.clientY || e.touches[0].clientY
            if(scroll < this.scrollState) return
            this.scrollOffset = scroll - this.scrollState
            this.$refs.swipableShareDialog.style.transition = 'transform 0s'
            this.$refs.swipableShareDialog.style.transform = `translateY(${this.scrollOffset}px)`
        },
        endSwipe() {
            if(this.scrollOffset > 100) {
                this.closeModal()
            } else {
                this.resetSwipe()
            }
        },
        resetSwipe() {
            this.$refs.swipableShareDialog.style.removeProperty('transform')
            this.$refs.swipableShareDialog.style.removeProperty('transition')
            this.scrollState = window.scrollY
        },
    }
}