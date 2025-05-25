<template>
  <div class="app">
    <Header />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" @request-remove="showRemoveModal" @error="showErrorModal" />
        </transition>
      </router-view>
    </main>
    <Modal
      :is-visible="modalState.isVisible"
      :confirm-button-text="modalState.confirmButtonText"
      :cancel-button-text="modalState.cancelButtonText"
      :show-confirm-button="modalState.showConfirmButton"
      :show-cancel-button="modalState.showCancelButton"
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
    >
      <template #content>
        <p v-if="modalState.type === 'remove'">{{ $t(modalState.messageKey) }}</p>
        <p v-if="modalState.type === 'limit'">{{ $t('limitExceeded1') }}</p>
        <p v-if="modalState.type === 'limit'">{{ $t('limitExceeded2') }}</p>
        <p v-if="modalState.type === 'error'">{{ $t(modalState.messageKey) }}</p>
      </template>
    </Modal>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Modal from './components/Modal.vue';

export default {
  components: {
    Header,
    Modal,
  },
  data() {
    return {
      modalState: {
        isVisible: false,
        type: '', // 'remove', 'limit', 'error'
        messageKey: '',
        confirmButtonText: '',
        cancelButtonText: '',
        showConfirmButton: true,
        showCancelButton: true,
        data: null,
      },
      removeCityCallback: null,
    };
  },
  methods: {
    showRemoveModal(city, callback) {
      this.modalState = {
        isVisible: true,
        type: 'remove',
        messageKey: 'confirmationMessage',
        confirmButtonText: '',
        cancelButtonText: '',
        showConfirmButton: true,
        showCancelButton: true,
        data: city,
      };
      this.removeCityCallback = callback;
    },
    showLimitModal() {
      this.modalState = {
        isVisible: true,
        type: 'limit',
        messageKey: '',
        confirmButtonText: 'OK',
        cancelButtonText: '',
        showConfirmButton: true,
        showCancelButton: false,
        data: null,
      };
    },
    showErrorModal(message) {
      this.modalState = {
        isVisible: true,
        type: 'error',
        messageKey: message,
        confirmButtonText: 'OK',
        showConfirmButton: true,
        showCancelButton: false,
        data: null,
      };
    },
    handleModalConfirm() {
      if (this.modalState.type === 'remove' && this.removeCityCallback) {
        this.removeCityCallback(this.modalState.data);
      }
      this.modalState.isVisible = false;
      this.removeCityCallback = null;
      this.modalState.data = null;
    },
    handleModalCancel() {
      this.modalState.isVisible = false;
      this.removeCityCallback = null;
      this.modalState.data = null;
    },
  },
};
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px); /* Adjust based on header height */
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(10px); /* Reduced shift for subtler effect */
}

.page-fade-enter-to,
.page-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>