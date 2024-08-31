<template>
  <div class="app">
    <Header />
    <main>
      <router-view @request-remove="showModalForRemoval" />
    </main>
    <ModalConfirm
      v-if="showModal"
      :messageKey="modalMessageKey"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import ModalConfirm from './components/ModalConfirm.vue';

export default {
  components: {
    Header,
    ModalConfirm
  },
  data() {
    return {
      showModal: false,
      modalMessageKey: '',
      cityToRemove: null,
      removeCityCallback: null, 
    };
  },
  methods: {
    showModalForRemoval(city, callback) {
      this.modalMessageKey = 'confirmationMessage'; 
      this.cityToRemove = city;
      this.removeCityCallback = callback;
      this.showModal = true;
    },
    handleConfirm() {
      if (this.removeCityCallback) {
        this.removeCityCallback(this.cityToRemove); 
      }
      this.showModal = false;
      this.cityToRemove = null;
      this.removeCityCallback = null;
    },
    handleCancel() {
      this.showModal = false;
      this.cityToRemove = null;
      this.removeCityCallback = null;
    }
  }
};
</script>
