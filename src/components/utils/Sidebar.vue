<template>
    <aside>
        <div a>
            <router-link to="/magazines?ref=landing_banner">
                <img src="/assets/banners/magazine_vertical.jpeg" alt="magazine publicité">
            </router-link>
        </div>
    </aside>
</template>

<style lang="scss" scoped>
aside {
    width: 268px;
    position: relative;
    margin: 16px 32px;
    margin-left: 0;

    [a] {
        position: sticky;
        top: 50px;

        img {
            width: 100%;
            height: auto;
            border: 1px solid #888;
        }
    }
}
</style>

<script>
export default {
    
}
</script>