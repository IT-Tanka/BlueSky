<template>
  <div class="favorite-page">
    <div class="container">
      <transition-group v-if="favoritesStore.favorites.length" name="fade" tag="div" class="weather-blocks-container">
        <WeatherBlock v-for="(city, index) in favoritesStore.favorites" :key="city" :city="city" @remove="removeBlock"
          @request-remove="showModalForRemoval" />
      </transition-group>
      <div v-else class="empty-favorites">
        <p class="empty-favorites__message">{{ $t('No favorite cities message') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useFavoritesStore } from '../stores/favorites';
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


<style lang="scss" scoped>
.favorite-page {
  padding: $header-height 0 $spacing-xxl 0;

  @media (max-width: 768px) {
    padding: 40px 0 $spacing-xl 0;
  }
}

.weather-blocks-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-xl;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.empty-favorites {
  @include flex-center;
  flex-direction: column;
  text-align: center;
  min-height: 50vh;
  color: $secondary-accent;
  font-size: $font-size-xxl;
}

.fade {
  &-enter-active,
  &-leave-active {
    @include transition(opacity, transform);
    transition-duration: 0.5s;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }

  &-enter-to,
  &-leave-from {
    opacity: 1;
    transform: translateY(0);
  }

  &-move {
    @include transition(transform);
    transition-duration: 0.5s;
  }
}
</style>