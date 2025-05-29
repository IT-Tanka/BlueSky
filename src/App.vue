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
  min-height: calc(100vh - 80px);
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-enter-to,
.page-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Резервируем пространство для полосы прокрутки */
:global(html),
:global(body) {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  scrollbar-gutter: stable;
  /* Резервирует место для полосы прокрутки */
  overflow-y: auto;
}

/* Запасной вариант для браузеров без поддержки scrollbar-gutter */
:global(html) {
  padding-right: var(--scrollbar-width, 0);
}

@supports (scrollbar-gutter: stable) {
  :global(html) {
    padding-right: 0;
    /* Убираем padding, если scrollbar-gutter поддерживается */
  }
}
</style>