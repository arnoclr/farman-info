const body = document.getElementById('body')

export const bottomSheatMixin = {
    props: ['open'],
    data() {
        return {
            scrollState: 0,
            scrollOffset: 0,
            isSwiping: false,
            scrollTop: true
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
            if(this.$refs.bodyDialog && this.$refs.bodyDialog.scrollTop != 0) {
                this.scrollTop = false
            } else {
                this.scrollTop = true
            }
        },
        swipe(e) {
            const scroll = e.clientY || e.touches[0].clientY
            if(scroll < this.scrollState || !this.scrollTop) return
            this.scrollOffset = scroll - this.scrollState
            this.$refs.swipableDialog.style.transition = 'transform 0s'
            this.$refs.swipableDialog.style.transform = `translateY(${this.scrollOffset}px)`
        },
        endSwipe() {
            if(this.scrollOffset > 100) {
                this.closeModal()
            } else {
                this.resetSwipe()
            }
            this.scrollOffset = 0
        },
        resetSwipe() {
            this.$refs.swipableDialog.style.removeProperty('transform')
            this.$refs.swipableDialog.style.removeProperty('transition')
            this.scrollState = window.scrollY
        },
    }
}