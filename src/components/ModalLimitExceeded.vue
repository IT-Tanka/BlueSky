<template>
    <div class="modal-overlay" @click="$emit('cancel')">
        <div class="modal-content" @click.stop>
            <button class="close-btn" @click="$emit('cancel')">×</button>
            <p>{{ $t('limitExceeded') }}</p>
            <button class="ok-btn" @click="$emit('confirm')">ok</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ModalLimitExceeded',
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    position: relative;
    text-align: center;
    width: 80%;
    max-width: 400px;
}
p{
    padding: 10px;
}
.close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.ok-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background-color:aqua;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}


</style>