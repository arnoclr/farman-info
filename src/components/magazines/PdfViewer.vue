<template>
    <div>
        <div v-if="!error" class="no-padding">
            <div class="summary" :class="summaryOpen ? 'open' : ''">
                <div class="scroll">
                    <a @click="$router.push('/magazine/' + $route.params.ref + '?ref=back_button')" class="icon-button">
                        <i class="material-icons">arrow_back</i>
                    </a>
                    <div
                        v-for="i in numPages"
                        :key="i"
                        @click="scrollTo(i)"
                        :class="(loadedPages.includes(i) ? 'loaded' : 'loading' ) + ' thumb'">
                        <pdf
                            :src="summaryThumbs ? src : null"
                            :page="i"
                            :active="i == currentPage"
                            :class="(i & 1 ? 'right' : 'left') + (i == 0 ? 'first' : '') + ' canvas'"
                        ></pdf>
                        <span>{{ i }}</span>
                    </div>
                </div>
            </div>

            <div v-if="src" id="main" v-on:scroll.passive="getCurrentPage">
                <button id="summary-trigger" @click="triggerSummary"></button>
                <div prev-page @click="scrollTo(currentPage - 1)">
                    <i class="material-icons">navigate_before</i>
                </div>
                <div next-page @click="scrollTo(currentPage + 1)">
                    <i class="material-icons">navigate_next</i>
                </div>
                <pdf
                    v-for="i in numPagesDefer"
                    :key="i"
                    :page="i"
                    :src="src"
                    @page-rendered="loaded(i)"
                    class="page"
                ></pdf>
            </div>

            <div class="loader"
                v-if="loading">
                <div sp>
                    <md-progress-spinner
                        :md-mode="loadingMode"
                        :md-value="loadingValue"></md-progress-spinner>
                </div>
            </div>
        </div>

        <div class="error" v-else>
            <p>Erreur: <ins>{{ error }}</ins></p>
            <a class="button-outlined" @click="$router.go(-1)">Revenir à la page précédente</a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.summary {
    height: 125px;
    margin-top: -125px;
    opacity: 0;
    background: #fff;
    transition: margin 350ms ease, opacity 350ms ease;

    .icon-button {
        position: absolute;
        z-index: 1;
        top: 8px;
        left: 8px;
        z-index: 2;
    }

    &.open {
        margin-top: 0;
        opacity: 1;

        &~#main {
            .page {
                filter: brightness(50%);
            }
            
            #summary-trigger {
                margin-top: 125px;

                &::before {
                    transform: rotate(-180deg);
                }
            }
        }
    }

    .scroll{
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
        padding-left: 64px;
        
        .thumb {
            display: inline-block !important;
            width: 64px;
            cursor: pointer;
            opacity: 1;
            transition: opacity 350ms ease;

            &.loading {
                opacity: 0.5;
            }

            .canvas {
                margin: 8px 8px 3px 8px;
                box-shadow: 0 0 0 1px #bbb;

                &.left {
                    margin-right: 0px;
                }

                &.right {
                    margin-left: 0px;
                }

                &[active] {
                    box-shadow: 0 0 0 3px teal;
                }
            }
        }
    }
}

#main {
    position: relative;
    overflow-x: scroll;
    white-space: nowrap;
    background: #000;
    scroll-snap-type: x mandatory;
    height: 100vh;
    align-items: center;
    display: -webkit-box;
    transition: height 350ms ease;
    color-scheme: dark;

    ::-webkit-scrollbar {
        width: 0;
    }

    #summary-trigger {
        position: fixed;
        top: 16px;
        left: 16px;
        height: 48px;
        width: 48px;
        padding: 0;
        background: rgba(50, 50, 50, 0.3);
        border: none;
        outline: none;
        cursor: pointer;
        z-index: 9;
        transition: height 350ms ease-out, margin-top 350ms ease;
        
        &::before {
            content: 'expand_more';
            display: inline-block;
            color: #fff;
            font-family: 'Material Icons Sharp';
            font-size: 48px;
            transition: transform 250ms ease 350ms;
            // margin-top: 12px;
        }
    }

    .page {
        display: inline-flex !important;
        width: 100vw;
        height: 100%;
        align-items: center;
        scroll-snap-align: start;
        transition: filter 350ms ease;
    }
}

.loader {
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    background-color: rgba(50, 50, 50, 0.3);
    z-index: 10;

    [sp] {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

@media screen and (min-width: 600px) {
    .no-padding {
        padding: 0px 25vw !important;
        background-color: #000;
    }

    [prev-page], [next-page] {
        position: fixed;
        height: 100vh;
        width: 64px;
        top: 0;
        cursor: pointer;
        z-index: 1;
        opacity: 0;
        background: rgba(0, 0, 0, 0.2);
        transition: opacity 150ms ease;
        display: flex;
        align-items: center;
        user-select: none;

        &:hover {
            opacity: 1;
        }

        i {
            color: white;
            font-size: 64px;
        }
    }

    #main .page {
        width: 50vw !important;
        overflow-x: hidden;

        @media screen and (min-width: 975px) {
            align-items: flex-start !important;
        }
    }

    [prev-page] {
        left: 0;
    }

    [next-page] {
        right: 0;
    }
}
</style>

<script>
import pdf from 'vue-pdf-render-event'
import browserFileStorage from 'browser-file-storage'
const {magazines} = require('../../firebaseConfig.js')
 
export default {
    components: {
        pdf
    },
    data() {
        return {
            loading: true,
            loadingMode: 'determinate',
            loadingValue: 0,
            src: null,
            numPages: undefined,
            numPagesDefer: 2,
            loadedPages: [],
            deferRendering: false,
            error: null,
            currentPage: 1,
            summaryOpen: false,
            summaryThumbs: false,
            storageKey: null
        }
    },
    created() {
        this.storageKey = this.$route.params.ref + '-progress'
        if(!browserFileStorage._init) {
            browserFileStorage.init('farman').then(status => {
                this.checkIfPdfIsStored()
            })
            .catch(error => {
                console.log(error)
                this.$root.$emit('toast', "Erreur lors de l'initialisation du stockage")
            })
        } else {
            this.checkIfPdfIsStored()
        }
    },
    methods: {
        loaded(page) {
            this.loadedPages.push(page)
            if(this.currentPage == page) {
                this.loading = false
            }
        },
        scrollTo(page) {
            if(page > this.numPagesDefer) {
                if(!this.loadedPages.includes(page)) {
                    this.loading = true
                    setTimeout(() => {
                        this.loading = false
                    }, 5000);
                }
                this.numPagesDefer = page
                setTimeout(() => {
                    this.scrollTo(page)
                }, 250);
            }
            document.getElementById('main').scrollTo({
                top: 0,
                left: (page - 1) * main.offsetWidth,
                behavior: 'smooth'
            })
        },
        triggerSummary() {
            this.summaryOpen = !this.summaryOpen
            if(!this.summaryThumbs) {
                setTimeout(() => {
                    this.summaryThumbs = true
                }, 350);
            }
        },
        getCurrentPage() {
            this.currentPage = Math.round(main.scrollLeft / main.offsetWidth) + 1
            this.saveProgress(this.currentPage)
            if(this.currentPage == this.numPagesDefer - 1 && !this.deferRendering) {
                this.deferRendering = true
                setTimeout(() => {
                    if(this.numPagesDefer < this.numPages) {
                        this.numPagesDefer++
                    }
                    this.deferRendering = false
                }, 500);
            }
        },
        saveProgress(page) {
            localStorage.setItem(this.storageKey ,page)
        },
        retrieveLastProgress() {
            let page = localStorage.getItem(this.storageKey)
            console.log(page)
        },
        downloadProgress(e) {
            this.loadingValue = e.loaded / e.total * 100
        },
        setSrc(url) {
            console.log(url)
            this.src = pdf.createLoadingTask(url, {onProgress: this.downloadProgress})
            this.src.promise.then(pdf => {
                this.loadingMode = 'indeterminate'
                this.numPages = pdf.numPages
                this.retrieveLastProgress()
            }).catch(err => {
                this.error = err
            })
        },
        checkIfPdfIsStored() {
            browserFileStorage.load(this.$route.params.ref).then(file => {
                this.$root.$emit('toast', 'Chargé depuis le stockage interne')
                let url = file.createURL()
                this.setSrc(url)
            }).catch((error) => {
                this.getMagazine()
            })
        },
        getMagazine() {
            this.src = this.error = null
            const ref = this.$route.params.ref
            magazines.doc(ref).get().then(snapshot => {
                if (this.$route.params.ref !== ref) return
                if(snapshot.data()) {
                    document.title = snapshot.data().title
                    this.setSrc(snapshot.data().url)
                } else {
                    this.error = 'Données non disponibles'
                }
            }).catch(err => {
                this.error = err
            })
        }
    }
}
</script>