<template>
  <main class="favorite-page">
    <div class="container">
      <transition-group v-if="favoritesStore.favorites.length" name="fade" tag="div" class="weather-blocks-container">
        <WeatherBlock v-for="(city, index) in favoritesStore.favorites" :key="city" :city="city" @remove="removeBlock"
          @request-remove="showModalForRemoval" />
      </transition-group>
      <div v-else class="empty-favorites">
        <p class="empty-favorites__message">{{ $t('No favorite cities message') }}</p>
      </div>
    </div>
  </main>
</template>

<script>
import { useFavoritesStore } from '../stores/favorites'; // Import the favorites store
import WeatherBlock from '../components/WeatherBlock.vue';

export default {
  components: {
    WeatherBlock,
  },
  setup() {
    const favoritesStore = useFavoritesStore();
    return { favoritesStore };
  },
  methods: {
    showModalForRemoval(city) {
      this.$emit('request-remove', city, this.removeBlock);
    },
    removeBlock(city) {
      this.favoritesStore.removeFavorite(city);
    },
  },
};
</script>

<style scoped>
.favorite-page {
    padding-top: 30px;
    padding-bottom: 30px;
}
.empty-favorites {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 50vh;
  color:#e28e07;
  font-size: 25px; 
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.fade-move {
    transition: transform 0.5s ease;
}
</style>