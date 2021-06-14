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
                <comments :doc="doc" v-if="open"></comments>
            </div>
        </div>
        <div class="fm-backdrop" @click="closeModal"></div>
    </div>
</template>

<script>
import {bottomSheatMixin} from '../../mixins/bottomSheat'

export default {
    mixins: [bottomSheatMixin],
    props: ['doc'],
    components: {
        Comments: () => import('./../utils/Comments.vue')
    }
}
</script>