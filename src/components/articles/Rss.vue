<template>
    <div>
        <pre>
&#x3C;?xml version=&#x22;1.0&#x22; encoding=&#x22;UTF-8&#x22; ?&#x3E;
&#x3C;rss version=&#x22;2.0&#x22;&#x3E;

    &#x3C;channel&#x3E;
        &#x3C;lastBuildDate&#x3E;{{ new Date(lastBuildDate).toUTCString() }}&#x3C;/lastBuildDate&#x3E;
        &#x3C;title&#x3E;Farman&#x3C;/title&#x3E;
        &#x3C;link&#x3E;https://farman.info&#x3C;/link&#x3E;
        &#x3C;description&#x3E;{{ description }}&#x3C;/description&#x3E;
        <template v-for="article in articles">
        &#x3C;item&#x3E;
            &#x3C;pubDate&#x3E;{{ new Date(article.createdAt.seconds * 1000).toUTCString() }}&#x3C;/pubDate&#x3E;
            &#x3C;title&#x3E;{{ article.title }}&#x3C;/title&#x3E;
            &#x3C;description&#x3E;{{ article.summary }}&#x3C;/description&#x3E;
            &#x3C;link&#x3E;https://farman.info/article/{{ article.id }}&#x3C;/link&#x3E;
            &#x3C;guid isPermaLink="true"&#x3E;https://farman.info/article/{{ article.id }}&#x3C;/guid&#x3E;
            &#x3C;media:content url="{{ article.thumbnail }}" /&#x3E;
            &#x3C;content:encoded&#x3E;
                &#x3C;![CDATA[{{ parseMd(article.content) }}]]&#x3E;
            &#x3C;/content:encoded&#x3E;
        &#x3C;/item&#x3E;
        </template>
    &#x3C;/channel&#x3E;
&#x3C;/rss&#x3E;
        </pre>
    </div>
</template>

<script>
import {db} from '../../firebaseConfig'
import {parseMd} from '../../assets/js/utils/mdParse'

export default {
    data() {
        return {
            lastBuildDate: document.documentElement.dataset.buildTimestampUtc,
            description: document.querySelector('meta[name="description"]').content,
            articles: []
        }
    },
    methods: {
        parseMd(t) { return parseMd(t) }
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