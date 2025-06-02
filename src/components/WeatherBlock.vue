<template>
  <div :class="['weather-card', { favorite: isFavorite }]">
    <div class="weather-card__btns">
      <button :disabled="isLoading" @click="$emit('request-remove', city)">
        <IconDelete />
      </button>
    </div>
    <Preloader :visible="isLoading" />
    <transition name="smooth-height">
      <div class="weather-block" v-if="!isLoading && weatherData && weatherData.forecast">
        <p class="weather-card__datetime">{{ formattedDateTime }}</p>
        <div class="weather-card__info">
          <h2>{{ weatherData.cityName }}</h2>
          <img :src="weatherIconUrl" :alt="weatherData.description || 'weather icon'" />
          <p class="weather-card__temp">{{ weatherData.temp }} °C</p>
        </div>
        <TempChart :forecastData="weatherData.forecast" :isHourly="isHourly" @update:isHourly="isHourly = $event" />
      </div>
    </transition>
  </div>
</template>

<script>
import { weatherService } from '../services/weatherService';
import { useFavoritesStore } from '../stores/favorites';
import IconDelete from './icons/IconDelete.vue';
import TempChart from './TempChart.vue';
import Preloader from './Preloader.vue';
import { formatDateTime } from '../utils/formatDate';

export default {
  props: {
    city: {
      type: String,
      required: true,
    },
  },
  components: {
    IconDelete,
    TempChart,
    Preloader,
  },
  setup() {
    const favoritesStore = useFavoritesStore();
    return { favoritesStore };
  },
  data() {
    return {
      weatherData: null,
      weatherIconUrl: '',
      isHourly: true,
      isFavorite: false,
      isLoading: false,
      currentTime: new Date(),
      timeInterval: null,
    };
  },
  computed: {
    formattedDateTime() {
      return formatDateTime(this.currentTime, this.$i18n.locale);
    },
  },
  watch: {
    city: {
      handler(newCity) {
        if (newCity) {
          this.fetchWeather(newCity);
          this.isFavorite = this.favoritesStore.isFavorite(newCity);
        } else {
          this.weatherData = null;
          this.weatherIconUrl = '';
          this.isLoading = false;
        }
      },
      immediate: true,
    },
    isHourly: {
      handler() {
        if (this.weatherData) {
          this.fetchForecast(this.weatherData.coord.lat, this.weatherData.coord.lon);
        }
      },
    },
  },
  mounted() {
    this.updateTime();
    this.timeInterval = setInterval(this.updateTime, 60000);
    this.isFavorite = this.favoritesStore.isFavorite(this.city);
  },
  beforeUnmount() {
    if (this.timeInterval) clearInterval(this.timeInterval);
  },
  methods: {
    updateTime() {
      this.currentTime = new Date();
    },
    async fetchWeather(city) {
      try {
        this.isLoading = true;
        const weather = await weatherService.getCurrentWeather(city);
        this.weatherData = { ...weather, forecast: [] };
        this.weatherIconUrl = `https://openweathermap.org/img/wn/${weather.iconCode}@2x.png`;
        await this.fetchForecast(weather.coord.lat, weather.coord.lon);
      } catch (error) {
        console.error('WeatherBlock: Error retrieving weather data:', error);
        this.weatherData = null;
        this.weatherIconUrl = '';
      } finally {
        this.isLoading = false;
      }
    },
    async fetchForecast(lat, lon) {
      try {
        let forecast;
        if (this.isHourly) {
          forecast = await weatherService.getHourlyForecast(lat, lon);
        } else {
          const weekly = await weatherService.getWeeklyForecast(lat, lon);
          const today = new Date();
          forecast = weekly.map((day, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() + index);
            return {
              dt: Math.floor(date.getTime() / 1000),
              main: { temp: day.temp + 273.15 },
              weather: [{ description: day.description, icon: day.iconCode }],
            };
          });
        }
        this.weatherData.forecast = forecast;
      } catch (error) {
        console.error('WeatherBlock: Error fetching forecast:', error);
        this.weatherData.forecast = [];
      }
    },
    toggleIsFavorite() {
      if (this.isFavorite) {
        this.favoritesStore.removeFavorite(this.city);
        this.isFavorite = false;
      } else {
        const success = this.favoritesStore.addFavorite(this.city);
        if (!success) {
          this.$emit('limit-exceeded');
          return;
        }
        this.isFavorite = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.weather-card {
  background-color: rgba($white, 0.8);
  transition: all $transition-duration $transition-easing;

  &__btns {
    border-radius: $border-radius-xl;
    text-align: right;

    button {
      width: 40px;
      height: 40px;
    }
  }
}

.weather-block {
  max-height: 1000px;
  opacity: 1;
  @include transition(max-height, opacity);
}

.smooth-height {

  &-enter-active,
  &-leave-active {
    @include transition(max-height, opacity);
  }

  &-enter-from,
  &-leave-to {
    max-height: 0;
    opacity: 0;
  }

  &-enter-to,
  &-leave-from {
    max-height: 1000px;
    opacity: 1;
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>