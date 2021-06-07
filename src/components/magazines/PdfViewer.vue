<template>
    <div>
        <div v-if="!error" class="no-padding">
            <div class="summary" :class="summaryOpen ? 'open' : ''">
                <div class="scroll" ref="scroll" v-on:scroll.passive="summaryScrolled">
                    <a @click="$router.go(-1)" class="icon-button">
                        <i class="material-icons">arrow_back</i>
                    </a>
                    <div
                        v-for="i in numPages"
                        :key="i"
                        @click="scrollTo(i)"
                        :class="(loadedPages.includes(i) ? 'loaded' : 'loading' ) + ' thumb'">
                        <pdf
                            v-if="i <= summaryThumbsToRender"
                            :src="summaryThumbs ? src : null"
                            :page="i"
                            :active="i == currentPage"
                            :class="(i & 1 ? 'right' : 'left') + (i == 0 ? 'first' : '') + ' canvas'"
                        ></pdf>
                        <div v-else
                            :class="(i & 1 ? 'right' : 'left') + (i == 0 ? 'first' : '') + ' canvas'"></div>
                        <span>{{ i }}</span>
                    </div>
                </div>
            </div>

            <div v-if="src" id="main" v-on:scroll.passive="getCurrentPage">
                <button id="summary-trigger" @click="triggerSummary"></button>
                <div prev-page @click="scrollTo(currentPage - 1)" :disabled="disableButtons">
                    <i class="material-icons">navigate_before</i>
                </div>
                <div next-page @click="scrollTo(currentPage + 1)" :disabled="disableButtons">
                    <i class="material-icons">navigate_next</i>
                </div>
                <div v-for="i in numPages"
                    :key="i"
                    :class="(fullscreen ? 'fullscreen' : 'margin') + ' page'">
                    <pdf v-if="loadedPages.includes(i)"
                        :page="i" :src="src"
                        @page-rendered="loaded(i)"></pdf>
                    <div v-else>chargement ...</div>
                </div>
            </div>

            <div class="loader"
                v-if="loading">
                <div sp>
                    <md-progress-spinner
                        :md-mode="loadingMode"
                        :md-value="loadingValue"></md-progress-spinner>
                </div>
            </div>

            <md-button id="fullscreen-trigger"
                :class="(fullscreen ? 'morphed' : '') + ' md-icon-button md-raised'" 
                @click="fullscreen = !fullscreen">
                <md-icon class="before">fullscreen</md-icon>
                <md-icon class="after">fullscreen_exit</md-icon>
                <md-tooltip md-delay="500" md-direction="left">Ajuster a l'écran</md-tooltip>
            </md-button>
        </div>

        <div class="error" v-else>
            <p>Erreur: <ins>{{ error }}</ins></p>
            <a class="button-outlined" @click="$router.go(-1)">Revenir à la page précédente</a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.no-padding {
    overflow-y: hidden;
}

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
            overflow: hidden;

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
        // display: inline-flex !important;
        width: 100vw;
        height: 100%;
        align-items: center;
        scroll-snap-align: start;
        transition: filter 350ms ease;
        background-color: #000;

        &>div {
            height: 100%;
            width: 100%;

            @media screen and(max-width: 490px) {
                display: flex;
                align-items: center;
            }
        }
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

#fullscreen-trigger {
    position: fixed;
    bottom: 32px;
    right: 32px;

    i {
        position: absolute;
        top: -12px;
        left: -12px;
        transition: transform .3s cubic-bezier(.25,.8,.25,1), opacity .3s cubic-bezier(.25,.8,.25,1);
    }

    .before {
        opacity: 1;
        transform: rotate(0) scale(1);
    }

    .after {
        opacity: 0;
        transform: rotate(90deg) scale(.7);
    }

    &.morphed {
        .before {
            opacity: 0;
            transform: rotate(-90deg) scale(.7);
        }

        .after {
            opacity: 1;
            transform: rotate(0) scale(1);
        }
    }
}

@media screen and (min-width: 600px) {
    .page canvas {
        height: 100vh !important;
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
            color: #fff;
            font-size: 64px;
        }

        &[disabled] {
            pointer-events: none;
            cursor: default;

            i {
                color: #aaa;
            }
        }
    }

    [prev-page] {
        left: 0;
    }

    [next-page] {
        right: 0;
    }
}

@media screen and (max-width: 500px) {
    #fullscreen-trigger {
        display: none;
    }
}

@media screen and (min-width: 1600px) {
    .no-padding {
        padding: 0px 25vw !important;
        background-color: #000;
    }

    #main .page {
        width: 50vw !important;

        @media screen and (min-width: 975px) {
            align-items: flex-start !important;
        }
    }
}
</style>

<style>
.annotationLayer {
    display: none;
}

@media screen and (min-width: 500px) {
    .page canvas {
        transition: height 350ms ease;
    }

    .margin canvas {
        height: 100vh !important;
        width: auto !important;
        margin: 0 auto;
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
            loadedPages: [1],
            deferRendering: false,
            error: null,
            currentPage: 1,
            summaryOpen: false,
            summaryThumbs: false,
            summaryThumbsToRender: 5,
            storageKey: null,
            disableButtons: false,
            fullscreen: false
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
            if(page == 1) return this.ready()
        },
        ready() {
            this.loading = false
            this.retrieveLastProgress()
        },
        scrollTo(page) {
            this.disableButtons = true
            setTimeout(() => {
                this.disableButtons = false
            }, 500)
            document.getElementById('main').scrollTo({
                top: 0,
                left: (page - 1) * main.offsetWidth,
                behavior: 'smooth'
            })
            setTimeout(() => {
                this.renderCurrentPage(page)
            }, 500)
        },
        renderCurrentPage(i) {
            if(!this.loadedPages.includes(i)) {
                this.loadedPages.push(i)
            }
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
            this.renderCurrentPage(this.currentPage)
        },
        summaryScrolled() {
            const thumbsSlided = this.$refs.scroll.scrollLeft / 64
            const thumbToRender = main.offsetWidth / 64 + thumbsSlided
            this.summaryThumbsToRender = 
                thumbToRender >= this.summaryThumbsToRender ?
                thumbToRender : this.summaryThumbsToRender
        },
        saveProgress(page) {
            localStorage.setItem(this.storageKey ,page)
        },
        retrieveLastProgress() {
            let page = localStorage.getItem(this.storageKey)
            this.scrollTo(page)
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