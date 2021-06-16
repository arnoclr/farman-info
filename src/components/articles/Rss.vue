<template>
    <div>
        <pre>
&#x3C;?xml version=&#x22;1.0&#x22; encoding=&#x22;UTF-8&#x22; ?&#x3E;
&#x3C;rss version=&#x22;2.0&#x22;&#x3E;

&#x3C;channel&#x3E;
&#x3C;title&#x3E;Farman&#x3C;/title&#x3E;
&#x3C;link&#x3E;https://farman.info&#x3C;/link&#x3E;
&#x3C;description&#x3E;{{ description }}&#x3C;/description&#x3E;
    <template v-for="article in articles">
    &#x3C;item&#x3E;
        &#x3C;title&#x3E;{{ article.title }}&#x3C;/title&#x3E;
        &#x3C;link&#x3E;https://farman.info/article/{{ article.id }}&#x3C;/link&#x3E;
        &#x3C;description&#x3E;{{ article.summary }}&#x3C;/description&#x3E;
    &#x3C;/item&#x3E;
    </template>
&#x3C;/channel&#x3E;
&#x3C;/rss&#x3E;
        </pre>
    </div>
</template>

<script>
import {db} from '../../firebaseConfig'

export default {
    data() {
        return {
            description: document.querySelector('meta[name="description"]').content,
            articles: []
        }
    },
    mounted() {
        db.collection('articles').orderBy('createdAt', 'desc').where('published', '==', true).limit(15).get()
        .then(docs => {
            docs.forEach(doc => {
                this.articles.push({id: doc.id, ...doc.data()})
            })
        })
    }
}
</script>