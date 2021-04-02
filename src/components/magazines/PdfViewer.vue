<template>
    <div>
        <div v-if="!error" class="no-padding">
            <div class="summary" :class="summaryOpen ? 'open' : ''">
                <div class="scroll">
                    <a @click="$router.go(-1)" class="icon-button"><i class="material-icons">arrow_back</i></a>
                    <div
                        v-for="i in numPages"
                        :key="i"
                        @click="scrollTo(i)"
                        class="thumb">
                        <pdf
                            :src="summaryThumbs ? src : null"
                            :page="i"
                            :active="i == currentPage"
                            class="canvas"
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
                    v-for="i in numPages"
                    :key="i"
                    :src="src"
                    @loaded="loaded(i)"
                    class="page"
                ></pdf>
                <div class="center" v-if="loading">
                    <svg class="loader" width="60" height="60" xmlns="http://www.w3.org/2000/svg" >
                        <g>
                            <ellipse ry="25" rx="25" cy="30" cx="30" stroke-width="5" stroke="teal" fill="none"/>
                        </g>
                    </svg>
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
    }

    &.open {
        margin-top: 0;
        opacity: 1;

        &~#main {
            height: calc(100vh - 125px);
            
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
        padding-left: 56px;
        
        .thumb {
            display: inline-block !important;
            width: 64px;
            margin: 3px 8px;
            cursor: pointer;

            .canvas {
                box-shadow: 0 0 0 1px #bbb;

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
        display: inline-block !important;
        width: 100vw;
        scroll-snap-align: start;
        transition: filter 350ms ease;
    }
}

.center {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
}

@media screen and (min-width: 600px) {
    [prev-page], [next-page] {
        position: fixed;
        height: 100vh;
        width: 32px;
        top: 0;
        cursor: pointer;
        z-index: 1;
        opacity: 0;
        background: rgba(0, 0, 0, 0.4);
        transition: opacity 150ms ease;
        display: flex;
        align-items: center;
        user-select: none;

        &:hover {
            opacity: 1;
        }

        i {
            color: white;
            font-size: 32px;
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
import pdf from 'vue-pdf'
import browserFileStorage from 'browser-file-storage'
const {magazines} = require('../../firebaseConfig.js')
 
export default {
    components: {
        pdf
    },
    data() {
        return {
            loading: true,
            src: null,
            numPages: undefined,
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
            if(page != this.numPages) return
            this.loading = false
        },
        scrollTo(page) {
            document.getElementById('main').scrollTo({
                top: 0,
                left: (page - 1) * window.innerWidth,
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
            this.currentPage = Math.round(main.scrollLeft / window.innerWidth) + 1
            this.saveProgress(this.currentPage)
        },
        saveProgress(page) {
            localStorage.setItem(this.storageKey ,page)
        },
        retrieveLastProgress() {
            let page = localStorage.getItem(this.storageKey)
            console.log(page)
        },
        setSrc(url) {
            console.log(url)
            this.src = pdf.createLoadingTask(url);
            this.src.promise.then(pdf => {
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