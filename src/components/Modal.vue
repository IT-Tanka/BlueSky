<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="$emit('cancel')">×</button>
          <slot name="content"></slot>
          <div class="modal-actions">
            <button v-if="showConfirmButton" class="modal-confirm" @click="$emit('confirm')">
              {{ confirmButtonText || $t('confirm') }}
            </button>
            <button v-if="showCancelButton" class="modal-cancel" @click="$emit('cancel')">
              {{ cancelButtonText || $t('cancel') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    confirmButtonText: {
      type: String,
      default: '',
    },
    cancelButtonText: {
      type: String,
      default: '',
    },
    showConfirmButton: {
      type: Boolean,
      default: true,
    },
    showCancelButton: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['confirm', 'cancel'],
  methods: {
    handleOverlayClick() {
      this.$emit('cancel');
    },
    handleKeydown(event) {
      if (event.key === 'Escape') {
        this.$emit('cancel');
      }
    },
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeydown);
  },
};
</script>
