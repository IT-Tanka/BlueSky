<template>
    <div v-if="visible" class="preloader">
        <div class="drop-container">
            <div class="drop"></div>
            <div class="drop"></div>
            <div class="drop"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style scoped>
.preloader {
    top: -50px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color:transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.drop-container {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    width: 100px;
    height: 100px;
}

.drop {
    width: 18px;
    height: 18px;
    background-color: aqua;
    border-radius: 50%;
    animation: drop 1s ease-in-out infinite;
}

.drop:nth-child(2) {
    animation-delay: 0.2s;
}

.drop:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes drop {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(20px);
    }
}
</style>