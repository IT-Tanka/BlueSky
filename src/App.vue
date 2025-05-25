<template>
  <div class="app">
    <Header />
    <main>
      <router-view
        @request-remove="showRemoveModal"
        @limit-exceeded="showLimitModal"
        @error="showErrorModal"
      />
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
</style>