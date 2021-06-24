<template>
    <div>
        <div
        v-touch:start="startSwipe"
        v-touch:moving="swipe"
        v-touch:end="endSwipe"
        ref="swipableDialog"
        :class="'fm-bottom-sheat ' + (open ? 'fm-bottom-sheat--open' : '')">
            <div class="fm-bottom-sheat__pill">
                <div></div>
            </div>
            <div ref="bodyDialog" class="fm-bottom-sheat__body">
                <comments :doc="doc" v-if="loaded"></comments>
            </div>
        </div>
        <div class="fm-backdrop" @click="closeModal"></div>
    </div>
</template>

<script>
import {bottomSheatMixin} from '../../mixins/bottomSheat'

export default {
    mixins: [bottomSheatMixin],
    props: ['doc', 'loaded'],
    components: {
        Comments: () => import('../Comments/Comments.vue')
    }
}
</script>