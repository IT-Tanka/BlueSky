<template>
  <main class="favorite-page">
    <div class="container">
      <transition-group v-if="weatherBlocks.length" name="fade" tag="div" class="weather-blocks-container">
        <WeatherBlock v-for="(city, index) in weatherBlocks" :key="city" :city="city" @remove="removeBlock"
          @request-remove="showModalForRemoval" />
      </transition-group>
      <div v-else class="empty-favorites">
        <p class="empty-favorites__message">{{ $t('No favorite cities message') }}</p>
      </div>
    </div>
  </main>
</template>

<script>
import WeatherBlock from '../components/WeatherBlock.vue';

export default {
    components: {
        WeatherBlock,
    },
    data() {
        return {
            weatherBlocks: JSON.parse(localStorage.getItem('favorites')) || [],
        };
    },
    methods: {
        showModalForRemoval(city) {
            this.$emit('request-remove', city, this.removeBlock);
        },
        removeBlock(city) {
            this.weatherBlocks = this.weatherBlocks.filter(blockCity => blockCity !== city);
            localStorage.setItem('favorites', JSON.stringify(this.weatherBlocks));
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
  color:white;
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