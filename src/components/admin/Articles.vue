<template>
    <div>
        <h1 class="md-title">Articles</h1>
        <div class="fm-articles-toolbar">
            <md-button title="rafraîchir" class="md-icon-button" @click="fetch(false)">
                <md-icon>refresh</md-icon>
            </md-button>
            <md-button title="page précedente" class="md-icon-button" @click="fetch('prev')">
                <md-icon>chevron_left</md-icon>
            </md-button>
            <md-button title="page suivante" class="md-icon-button" @click="fetch('next')">
                <md-icon>chevron_right</md-icon>
            </md-button>
        </div>

        <ul class="fm-articles-table" v-if="articles.length > 0">
            <li v-for="article in articles" :key="article.id" class="fm-articles-table__panel">
                <img class="fm-articles-table__panel-thumbnail" :src="article.thumbnail" :alt="article.tags">
                <h1 class="fm-articles-table__panel-title">{{ article.title }}</h1>
                <small class="fm-articles-table__panel-subtitle">{{ article.id }}, {{ (new Date(article.createdAt.toDate())).toLocaleDateString("fr-FR") }}</small>

                <ul class="fm-options">
                    <li class="fm-options__action">
                        <md-switch v-model="article.published" @change="triggerItem(article.id)" class="md-primary"></md-switch>
                        <label>Rendre l'article publique</label>
                    </li>
                    <li class="fm-options__action">
                        <md-switch v-model="article.breaking" @change="triggerItem(article.id)" class="md-primary"></md-switch>
                        <label>Mettre l'article à la une</label>
                    </li>
                    <li class="fm-options__action">
                        <md-switch v-model="article.needLogin" @change="triggerItem(article.id)" class="md-primary"></md-switch>
                        <label>Restreindre aux personnes connectées</label>
                    </li>
                </ul>
            
                <div class="fm-articles-table__panel-buttons">
                    <md-button class="md-icon-button" @click="$router.push('/article/' + article.id)">
                        <md-icon>visibility</md-icon>
                    </md-button>
                    <md-button class="md-icon-button" @click="$router.push('/article/' + article.id + '/edit')">
                        <md-icon>edit</md-icon>
                    </md-button>
                    <md-button class="md-icon-button" @click="remove(article.id)">
                        <md-icon>delete</md-icon>
                    </md-button>
                </div>

                <md-chips class="fm-articles-table__panel-tags" v-model="article.tags" md-static></md-chips>
            </li>
        </ul>

        <div class="fm-section fm-section--center" style="height:90vh" v-else>
            <div class="fm-section__centered-item">
                <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
            </div>
        </div>
    </div>
</template>

<script>
import { db } from '../../firebaseConfig'
import { getDocs, updateDoc, deleteDoc, doc, collection, startAfter, endBefore, query, orderBy, limit } from 'firebase/firestore'

const articles = collection(db, 'articles')

export default {
    data() {
        return {
            articles: [],
            lastVisible: null,
            firstVisible: null,
            lastQuery: null,
        }
    },
    methods: {
        async fetch(page = false) {
            this.articles = []
            let constraints = []

            if (page == 'next') constraints.push(startAfter(this.lastVisible.createdAt))
            if (page == 'prev') constraints.push(endBefore(this.firstVisible.createdAt))

            let q = query(articles, orderBy('createdAt', 'desc'), ...constraints, limit(15))

            console.log(this.lastQuery)

            if (this.lastQuery != null && page == false) q = this.lastQuery

            const articlesSnapshot = await getDocs(q)

            if(articlesSnapshot.empty) {
                this.$root.$emit('toast', 'Aucun résultat après cette page')
                return this.fetch(false)
            }
            articlesSnapshot.forEach(doc => {
                let buffer = doc.data()
                buffer.id = doc.id
                this.articles.push(buffer)
            })
            this.lastQuery = q
            this.firstVisible = this.articles[0]
            this.lastVisible = this.articles[this.articles.length - 1]
            this.$root.$emit('toast', 'Tableau actualisé')
        },
        async triggerItem(id) {
            let item = this.articles.find(o => o.id == id)
            const articleRef = doc(articles, id)

            await updateDoc(articleRef, item)
            this.fetch()
        },
        async remove(id) {
            if(!(confirm('Supprimer ?'))) return
            await deleteDoc(doc(articles, id))
            this.fetch()
            this.$root.$emit('toast', id + ' supprimé avec succès')
        }
    },
    created () {
        this.fetch()
    }
}
</script>