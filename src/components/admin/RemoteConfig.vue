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
                    <button class="fm-button fm-button--flat" @click="remove(index)">supprimer</button>
                </md-card-actions>
            </md-card>
        </div>

        <image-uploader :callback="appendImage" :open.sync="imageUploaderOpen"></image-uploader>
        <button class="fm-button" @click="addBanner">Ajouter une annonce</button>
        <button class="fm-button" @click="generateJson">générer le code <md-icon>code</md-icon></button>
        <a target="_blank" href="https://console.firebase.google.com/u/0/project/actualites-aeronautiques/config" class="fm-button fm-button--outlined">Ouvrir la console firebase <md-icon>launch</md-icon></a>
        <a target="_blank" href="https://imgur.com/a/dZ9gBHX" class="fm-button fm-button--flat">Tutoriel <md-icon>launch</md-icon></a>

        <md-field>
            <md-textarea v-model="jsonString" onclick="this.select()" readonly></md-textarea>
        </md-field>
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