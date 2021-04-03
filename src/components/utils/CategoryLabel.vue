<template>
    <div>
        <router-link l :to="'/articles/category/' + category.id + '?ref=' + linkRef">
            <md-list-item pastille>
                <div wrapper class="md-list-item-text" 
                    v-bind:style="{background: category.color + '20'}">
                    <span v-bind:style="{color: category.color}">{{ category.label }}</span>
                </div>
            </md-list-item>
        </router-link>
    </div>
</template>

<style lang="scss" scoped>
[l] {
    text-decoration: none;

    [pastille] {
        list-style: none;
        z-index: 0;

        [wrapper] {
            border-radius: 6px;
            padding: 8px 16px;
            width: fit-content;
            z-index: 0;
        }
    }
}
</style>

<script>
export default {
    props: [
        'category',
        'linkRef'
    ]
}
</script>