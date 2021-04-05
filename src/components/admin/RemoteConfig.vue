<template>
    <div>
        <div ad>
            <md-card el v-for="(banner, index) in banners" :key="index">
                <md-card-header>
                    <md-card-header-text>
                        <div class="md-title">{{ index }}</div>
                        <md-field>
                            <label :for="index">Lien</label>
                            <md-input v-model="banner.link" :id="index"></md-input>
                        </md-field>
                    </md-card-header-text>

                    <md-card-media>
                        <img :src="banner.image">
                    </md-card-media>
                </md-card-header>

                <md-card-actions>
                    <md-button @click="remove(index)">supprimer</md-button>
                </md-card-actions>
            </md-card>
        </div>

        <image-uploader :callback="appendImage" :open.sync="imageUploaderOpen"></image-uploader>
        <md-button @click="addBanner">Ajouter une annonce</md-button>

        <md-card>
            <md-card-content>
                <md-field>
                    <md-textarea v-model="jsonString" onclick="this.select()" readonly></md-textarea>
                </md-field>
                <md-button @click="generateJson">générer le code</md-button>
            </md-card-content>
        </md-card>

        <md-card mt>
            <md-card-content>
                <a target="_blank" href="https://console.firebase.google.com/u/0/project/actualites-aeronautiques/config" class="button">Ouvrir la console firebase</a>
                
                <details>
                    <summary>
                        <md-list-item>
                            <md-icon>expand_more</md-icon>
                            <span class="md-list-item-text">Tutoriel</span>
                        </md-list-item>
                    </summary>
                    <img src="https://i.imgur.com/fCk1eXm.jpg" alt="remote config screen 1">
                    <img src="https://i.imgur.com/IywofI9.jpg" alt="remote config screen 2">
                </details>
            </md-card-content>
        </md-card>
    </div>
</template>

<style lang="scss" scoped>
[ad] {
    [el] {
        display: inline-block;
        margin-bottom: 8px;
        margin-right: 8px;

        img {
            object-fit: cover;
            height: 90px;
            width: 90px;
        }
    }
}

[mt] {
    margin-top: 16px;
}
</style>

<script>
import {remoteConfig} from '../../firebaseConfig'

export default {
    components: {
        imageUploader: () => import('../utils/ImageUploader')
    },
    data() {
        return {
            banners: {},
            jsonString: '',
            imageUploaderOpen: false
        }
    },
    methods: {
        addBanner() {
            this.imageUploaderOpen = true
        },
        appendImage(url) {
            let key = prompt('Nom de la pub')
            this.$set(this.banners, key, {image: url})
        },
        generateJson() {
            this.jsonString = JSON.stringify(this.banners)
        },
        remove(key) {
            this.$delete(this.banners, key)
        }
    },
    mounted() {
        remoteConfig.fetchAndActivate()
            .then(() => {
                this.banners = JSON.parse(remoteConfig.getString('sidebar_banners'))
            })
            .catch((err) => { console.error(err) })
    }
}
</script>