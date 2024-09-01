<template>
    <div class="modal-overlay" @click="$emit('cancel')">
        <div class="modal-content" @click.stop>
            <button class="modal-close" @click="$emit('cancel')">×</button>
            <p>{{ $t('limitExceeded1') }}</p>
            <p>{{ $t('limitExceeded2') }}</p>
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
p{
    margin: 5px auto;
    padding: 2px;
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