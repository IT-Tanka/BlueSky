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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

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
  display: flex;
  justify-content: center;
  gap: 10px;
}

.modal-confirm {
  background: rgba(0, 255, 255, 0.389);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
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

/* Анимации */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.8);
  opacity: 0;
}
</style>