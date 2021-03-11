<template>
    <div v-if="src" class="main">
        <pdf
            v-for="i in numPages"
            :key="i"
            :src="src"
            :page="i"
            class="page"
        ></pdf>
    </div>
</template>

<style scoped>
.main {
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    background: #000;
    scroll-snap-type: x mandatory;
    height: 100vh;
    width: fit-content;
    align-items: center;
    display: flex;
}

.page {
    display: inline-block !important;
    width: 100vw;
    scroll-snap-align: start;
}
</style>

<script>
import pdf from 'vue-pdf'
const {magazines} = require('../../firebaseConfig.js')
 
export default {
    components: {
        pdf
    },
    data() {
        return {
            loading: false,
            src: null,
            numPages: undefined,
            error: null
        }
    },
    created() {
        this.getMagazine()
    },
    methods: {
        getMagazine() {
            this.src = this.error = null
            this.loading = true
            const ref = this.$route.params.ref
            magazines.doc(ref).get().then(snapshot => {
                if (this.$route.params.ref !== ref) return
                this.loading = false
                if(snapshot.data()) {
                    this.src = pdf.createLoadingTask(snapshot.data().url);
                    this.src.promise.then(pdf => {
                        this.numPages = pdf.numPages;
                    });
                } else {
                    this.error = true
                }
            })
        }
    }
}
</script>