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
    <Modal :is-visible="modalState.isVisible" :confirm-button-text="modalState.confirmButtonText"
      :cancel-button-text="modalState.cancelButtonText" :show-confirm-button="modalState.showConfirmButton"
      :show-cancel-button="modalState.showCancelButton" @confirm="handleModalConfirm" @cancel="handleModalCancel">
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
  components: { Header, Modal },
  data() {
    return {
      modalState: {
        isVisible: false,
        type: '',
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
  mounted() {
    this.setScrollbarWidth();
    window.addEventListener('resize', this.setScrollbarWidth);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.setScrollbarWidth);
  },
  methods: {
    setScrollbarWidth() {
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll';
      outer.style.width = '100px';
      document.body.appendChild(outer);

      const inner = document.createElement('div');
      outer.appendChild(inner);

      const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
      document.body.removeChild(outer);
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    },
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

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: url(./assets/sky.jpg);
  background-size: cover;
}

.page-fade {
  &-enter-active,
  &-leave-active {
    @include transition(opacity, transform);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }

  &-enter-to,
  &-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>