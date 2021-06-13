<template>
    <div id="notificationsOverlay">
        <!-- android chrome bottom popup -->
        <div class="chrome-android" v-if="$browserDetect.isChrome && $device.android">
            <md-icon>south</md-icon>
            <p>Cliquez sur détails et selectionnez autoriser</p>
        </div>
    </div>
</template>

<style lang="scss">
#notificationsOverlay {
    display: none;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 9;

    .chrome-android {
        position: fixed;
        height: 120px;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 16px;
        padding-bottom: calc(16px + 48px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: teal;
        box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.20);

        p, i {
            color: #fff;
        }

        i {
            animation: vertical-bounce 1s ease infinite;
        }
    }
}

@keyframes vertical-bounce {
    0% {
        transform: translateY(8px);
    }

    50% {
        transform: translateY(-8px);
    }

    100% {
        transform: translateY(8px);
    }
}
</style>

<script>
export default {

}
</script>