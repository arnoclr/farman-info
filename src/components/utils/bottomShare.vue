<template>
    <div>
        <div
        v-touch:start="startSwipe"
        v-touch:moving="swipe"
        v-touch:end="endSwipe"
        ref="swipableShareDialog"
        :class="'fm-bottom-sheat ' + (open ? 'fm-bottom-sheat--open' : '')">
            <div class="fm-bottom-sheat__pill">
                <div></div>
            </div>
            <div class="fm-bottom-sheat__body">
                <div class="fm-bottom-sheat__body-grid">
                    <a 
                    :href="'https://wa.me/?text=' + url"
                    @click="logEvent('whatsapp')"
                    target="_blank" rel="noreferrer noopener"
                    class="fm-bottom-sheat__body-grid-item">
                        <img src="/assets/icons/apps/com.whatsapp.webp" class="fm-bottom-sheat__body-grid-item-icon">
                        <span class="fm-bottom-sheat__body-grid-item-text">WhatsApp</span>
                    </a>
                    <a 
                    :href="'https://twitter.com/intent/tweet?text=' + url"
                    @click="logEvent('twitter')"
                    target="_blank" rel="noreferrer noopener"
                    class="fm-bottom-sheat__body-grid-item">
                        <img src="/assets/icons/apps/com.twitter.android.webp" class="fm-bottom-sheat__body-grid-item-icon">
                        <span class="fm-bottom-sheat__body-grid-item-text">Twitter</span>
                    </a>
                    <a 
                    :href="'https://www.facebook.com/sharer/sharer.php?s=100&p[url]=' + url"
                    @click="logEvent('facebook')"
                    target="_blank" rel="noreferrer noopener"
                    class="fm-bottom-sheat__body-grid-item">
                        <img src="/assets/icons/apps/com.facebook.katana.webp" class="fm-bottom-sheat__body-grid-item-icon">
                        <span class="fm-bottom-sheat__body-grid-item-text">Facebook</span>
                    </a>
                    <a 
                    :href="'https://t.me/share/url?url=' + url"
                    @click="logEvent('telegram')"
                    target="_blank" rel="noreferrer noopener"
                    class="fm-bottom-sheat__body-grid-item">
                        <img src="/assets/icons/apps/org.telegram.messenger.webp" class="fm-bottom-sheat__body-grid-item-icon">
                        <span class="fm-bottom-sheat__body-grid-item-text">Telegram</span>
                    </a>
                    <a 
                    @click="copyUrl()"
                    target="_blank" rel="noreferrer noopener"
                    class="fm-bottom-sheat__body-grid-item">
                        <i class="fm-bottom-sheat__body-grid-item-icon material-icons">content_copy</i>
                        <span class="fm-bottom-sheat__body-grid-item-text">Copier le lien</span>
                    </a>
                    <a 
                    v-if="webShareApiSupported"
                    @click="nativeShare()"
                    target="_blank" rel="noreferrer noopener"
                    class="fm-bottom-sheat__body-grid-item">
                        <i class="fm-bottom-sheat__body-grid-item-icon material-icons">{{ $device.ios ? 'ios_share' : 'share' }}</i>
                        <span class="fm-bottom-sheat__body-grid-item-text">Autres options</span>
                    </a>
                </div>
            </div>
        </div>
        <div class="fm-backdrop" @click="closeModal"></div>
    </div>
</template>

<script>
import {analytics} from '../../firebaseConfig'
const body = document.getElementById('body')

export default {
    props: ['url', 'open'],
    data() {
        return {
            shareData: {
                title: document.title,
                url: this.url,
            },
            scrollState: 0,
            scrollOffset: 0,
            isSwiping: false,
            canceled: true
        }
    },
    computed: {
        webShareApiSupported() {
            return navigator.share
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
            if(this.canceled) {
                analytics.logEvent('article_shared', {
                    canceled: this.canceled,
                    display_mode: window.PWADisplayMode
                })
            }
        },
        logEvent(provider) {
            this.canceled = false
            analytics.logEvent('article_shared', {
                canceled: this.canceled,
                provider: provider,
                display_mode: window.PWADisplayMode
            })
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
        nativeShare() {
            try {
                navigator.share(this.shareData)
                this.logEvent('native_share')
            } catch(err) {
                alert(err)
            }
        },
        copyUrl() {
            const el = document.createElement('textarea')
            el.value = this.url
            el.setAttribute('readonly', '')
            el.style.position = 'absolute'
            el.style.left = '-9999px'
            document.body.appendChild(el)
            const selected =  document.getSelection().rangeCount > 0  ? document.getSelection().getRangeAt(0) : false;
            el.select()
            try {
                document.execCommand('copy')
                this.$root.$emit('toast', 'Lien copié dans le presse papier')
                this.logEvent('copy_link')
            } catch {
                this.$root.$emit('toast', 'Erreur lors de la copie du lien')
            }
            document.body.removeChild(el)
            if(selected) {
                document.getSelection().removeAllRanges()
                document.getSelection().addRange(selected)
            }
        },
    }
}
</script>