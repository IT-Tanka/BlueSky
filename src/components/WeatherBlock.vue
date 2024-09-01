<template>
  
  <div :class="['weather-card', { favorite: isFavorite }]">
    <div class="weather-card__btns">
      <button v-if="weatherData && weatherData.forecast" :disabled="isLoading" class="weather-card__btn add-to-fav__btn"
        @click="toggleIsFavorite">
        <IconAddToFavorite />
      </button>
      <button :disabled="isLoading" @click="$emit('request-remove', city, removeBlock)">
        <IconDelete />
      </button>
    </div>
    <slot v-if="!isLoading" name="city-input"></slot>
    <Preloader :visible="isLoading" />
    <div class="weather-block" v-if="!isLoading && weatherData && weatherData.forecast">
      <div v-if="weatherData" class="weather-card__info">
        <h2>{{ weatherData.cityName }}</h2>
        <p>{{ weatherData.description }}</p>
        <p>{{ weatherData.temp }} °C</p>
      </div>
      <TempChart :forecastData="weatherData.forecast" :isHourly="isHourly" @update:isHourly="isHourly = $event" />
    </div>
  </div>
</template>

<script>
import { getWeatherByCity, getWeatherForecastByCoords } from '../api/weather';
import IconAddToFavorite from './icons/IconAddToFavorite.vue';
import IconDelete from './icons/IconDelete.vue';
import TempChart from './TempChart.vue';
import Preloader from './Preloader.vue';

export default {
  props: {
    city: {
      type: String,
      required: true,
    },
  },
  components: {
    IconAddToFavorite,
    IconDelete,
    TempChart,
    Preloader
  },
  data() {
    return {
      weatherData: null,
      isHourly: true,
      isFavorite: false,
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
      isLoading: true,
    };
  },
  mounted() {
    if (this.favorites.includes(this.city)) this.isFavorite = true;
    if (this.city.length) this.fetchWeather(this.city);
  },
  methods: {
    async fetchWeather(city) {
      try {
        this.isLoading = true;
        const weather = await getWeatherByCity(city);
        const forecast = await getWeatherForecastByCoords(weather.coord.lat, weather.coord.lon);
        this.weatherData = {
          cityName: weather.name,
          description: weather.weather[0].description,
          temp: Math.round(weather.main.temp - 273.15),
          forecast: forecast.list,
        };
      } catch (error) {
        console.error('Error retrieving weather data:', error);
      } finally {
      this.isLoading = false;
    }
    },

    toggleIsFavorite() {
      this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      if (this.favorites.includes(this.city)) {
        this.isFavorite = false;
        this.favorites = this.favorites.filter(favCity => favCity !== this.city);
      } else {
        if (this.favorites.length >= 5) {
          this.$emit('limit-exceeded');
          return;
        }
        this.isFavorite = true;
        this.favorites.unshift(this.city);
      }
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    removeBlock(city) {
      this.$emit('remove', city);
    },
  },
};
</script>

<style scoped>
.weather-card {
  width: 100%;
  min-height: 50px;
  border-radius: 20px;
  border: 1px solid lightblue;
  padding: 10px 20px;
  margin: 0 auto;
  background-color: white;
}

.weather-card__btns {
  border-radius: 20px;
  text-align: right;

  button {
    width: 40px;
    height: 40px;
  }
}

.weather-card__info {
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  align-items: center;

}

.weather-card.favorite .weather-card__btn {
  color: aqua;
}
</style>