<template>
    <div class="modal-overlay" @click="$emit('cancel')">
        <div class="modal-content" @click.stop>
            <button class="modal-close" @click="$emit('cancel')">&times;</button>
            <p>{{ $t(messageKey) }}</p>
            <div class="modal-actions">
                <button class="modal-confirm" @click="$emit('confirm')">{{ $t('confirm') }}</button>
                <button class="modal-cancel" @click="$emit('cancel')">{{ $t('cancel') }}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        messageKey: {
            type: String,
            required: true,
        },
    },
};
</script>

<style scoped>
.modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #333;
} 

.modal-actions {
    margin-top: 20px;
}

.modal-confirm {
    background: rgba(0, 255, 255, 0.389);
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-right: 10px;
}

.modal-cancel {
    background: #e9ae50;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

</style>
