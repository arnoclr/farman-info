<template>
    <div>
        <md-table v-model="searched" md-sort="title" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                    <h1 class="md-title">Articles</h1>
                    <md-button class="md-icon-button" @click="fetch">
                        <md-icon>refresh</md-icon>
                    </md-button>
                </div>

                <md-field md-clearable class="md-toolbar-section-end">
                    <md-input placeholder="id:KEmKRg ou titre:Les nouveaux ..." v-model="search" @input="searchOnTable" />
                </md-field>
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID" md-sort-by="id">{{ item.id }}</md-table-cell>
                <md-table-cell md-label="Titre" md-sort-by="title">{{ item.title }}</md-table-cell>
                <md-table-cell md-label="Date de publication" md-sort-by="createdAt">
                    {{ (new Date(item.createdAt.toDate())).toLocaleDateString("fr-FR") }}
                </md-table-cell>
                <md-table-cell md-label="Publié ?" md-sort-by="published">
                    <md-switch v-model="item.published" @change="triggerPublished(item.id)" class="md-primary"></md-switch>
                </md-table-cell>
                <md-table-cell md-label="Actions" actions>
                    <md-button class="md-icon-button" @click="$router.push('/article/' + item.id)">
                        <md-icon>visibility</md-icon>
                    </md-button>
                    <md-button class="md-icon-button" @click="$router.push('/article/' + item.id + '/edit')">
                        <md-icon>edit</md-icon>
                    </md-button>
                    <md-button class="md-icon-button" @click="remove(item.id)">
                        <md-icon>delete</md-icon>
                    </md-button>
                </md-table-cell>
            </md-table-row>
        </md-table>

        <md-button class="md-icon-button" @click="fetch('prev')">
            <md-icon>chevron_left</md-icon>
        </md-button>
        <md-button class="md-icon-button" @click="fetch('next')">
            <md-icon>chevron_right</md-icon>
        </md-button>
    </div>
</template>

<style lang="scss" scoped>
[actions] button {
    display: inline-block;
}
</style>

<script>
import {db} from '../../firebaseConfig'
const articles = db.collection('articles')

const toLower = text => {
    return text.toString().toLowerCase()
}

const searchByAny = (items, term) => {
    if (term) {
        let parts = term.split(':')
        let key = parts.length > 1 ? parts[0] : 'title'
        term = parts.length > 1 ? parts[1] : term
        return items.filter(item => toLower(item[key]).includes(toLower(term)))
    }

    return items
}
export default {
    data() {
        return {
            articles: [],
            search: null,
            searched: [],
            lastVisible: null,
            firstVisible: null
        }
    },
    methods: {
        searchOnTable () {
            this.searched = searchByAny(this.articles, this.search)
        },
        fetch(page = false) {
            this.articles = []
            let query = articles.orderBy('createdAt', 'desc')
            query = page == 'next' ? query.startAfter(this.lastVisible.createdAt) : query
            query = page == 'prev' ? query.endBefore(this.firstVisible.createdAt) : query
            
            query.limit(15).get().then(snapshot => {
                if(snapshot.empty)
                    return this.$root.$emit('toast', 'Aucun résultat après cette page')
                snapshot.forEach(doc => {
                    let buffer = doc.data()
                    buffer.id = doc.id
                    this.articles.push(buffer)
                })
                this.firstVisible = this.articles[0]
                this.lastVisible = this.articles[this.articles.length - 1]
                this.searched = this.articles
                this.$root.$emit('toast', 'Tableau actualisé')
            }, err => {
                this.$root.$emit('toast', err)
                console.error(err)
            })
        },
        triggerPublished(id) {
            let item = this.articles.find(o => o.id == id)
            articles.doc(id).update(item).then(() => {
                this.fetch()
            }).catch(err => {
                this.$root.$emit('toast', err)
                console.error(err)
            })
        },
        remove(id) {
            if(!(confirm('Supprimer ?'))) return
            articles.doc(id).delete().then(() => {
                this.fetch()
                this.$root.$emit('toast', id + ' supprimé avec succès')
            }).catch(err => {
                this.$root.$emit('toast', err)
            })
        }
    },
    created () {
        this.fetch()
    }
}
</script>