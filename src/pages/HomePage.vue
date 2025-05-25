<template>
  <main class="home-page">
    <div class="container">
      <button class="add-block-btn" @click.stop="showAddCityModal">
        {{ $t('Add City') }}
        <IconAddBlock />
      </button>
      <Preloader v-if="isLoading" :visible="isLoading" />
      <div v-else-if="weatherData" class="weather-sections">
        <!-- Weather Info Block -->
        <div :class="['weather-card', { favorite: isFavorite }]">
          <div class="weather-card__top">
            <p class="weather-card__datetime">{{ formattedDateTime }}</p>
            <button :disabled="isLoading" class="weather-card__btn add-to-fav__btn" @click="toggleIsFavorite">
              <IconAddToFavorite />
            </button>
          </div>
          <div class="weather-card__info">
            <h2>{{ weatherData.cityName }}</h2>

            <img :src="weatherIconUrl" :alt="weatherData.description || 'weather icon'" />
            <p class="weather-card__temp">{{ weatherData.temp }} °C</p>

            <ul class="addition-info">
              <li> <span class="addition__point">{{ $t('Humidity') }}:</span> {{ additionalData.humidity }}%</li>
              <li><span class="addition__point">{{ $t('Pressure') }}:</span> {{ additionalData.pressure }}hPa</li>
              <li><span class="addition__point">{{ $t('Wind Speed') }}: </span> {{ additionalData.windSpeed }}m/s</li>
            </ul>
          </div>
        </div>

        <!-- Block 1: Hourly Forecast -->
        <div class="weather-section hourly-forecast">
          <div v-if="hourlyForecast.length" class="hourly-scroll">
            <div class="hourly-card">
              <div class="hourly-times">
                <span v-for="item in hourlyForecast" :key="item.time">{{ item.time }}</span>
              </div>
              <div class="hourly-data">
                <div v-for="item in hourlyForecast" :key="item.time" class="hourly-item">
                  <img :src="getIconUrl(item.iconCode)" :alt="weatherData.description || 'weather icon'" />
                  <span>{{ item.temp }}°C</span>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="no-data">{{ $t('No hourly data available') }}</p>
        </div>
        <!-- Block 2: Weekly Forecast -->
        <div class="weather-section weekly-forecast">
          <h2>{{ $t('Weekly Forecast') }}</h2>
          <table>
            <tbody>
              <tr v-for="item in weeklyForecast" :key="item.date">
                <td>{{ item.date }}</td>
                <td>{{ item.temp }} °C</td>
               <td class="table__description">{{ $t(item.description) }}</td>
                <td><img :src="getIconUrl(item.iconCode)" :alt="item.description" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="error">{{ $t('Failed to load weather data') }}</div>
    </div>
    <Modal v-if="state && state.modalState" :is-visible="state.modalState.isVisible"
      :confirm-button-text="state.modalState.confirmButtonText" :cancel-button-text="state.modalState.cancelButtonText"
      :show-confirm-button="state.modalState.showConfirmButton" :show-cancel-button="state.modalState.showCancelButton"
      @confirm="handleModalConfirm" @cancel="handleModalCancel">
      <template #content>
        <CityInput v-if="state.modalState.type === 'add-city'" @city-selected="handleCitySelected"
          @cancel="handleModalCancel" @error="showErrorModal" />
      </template>
    </Modal>
  </main>
</template>

<script>
import { reactive } from 'vue';
import { useLanguageStore } from '../stores/language';
import IconAddBlock from '../components/icons/IconAddBlock.vue';
import IconAddToFavorite from '../components/icons/IconAddToFavorite.vue';
import CityInput from '../components/CityInput.vue';
import Modal from '../components/Modal.vue';
import Preloader from '../components/Preloader.vue';
import { weatherService } from '../services/weatherService';
import { getCityByIP } from '../services/weather';
import { formatDateTime } from '../utils/formatDate';

export default {
  components: {
    IconAddBlock,
    IconAddToFavorite,
    CityInput,
    Modal,
    Preloader
  },
  setup() {
    const state = reactive({
      modalState: {
        isVisible: false,
        type: '',
        confirmButtonText: '',
        cancelButtonText: '',
        showConfirmButton: false,
        showCancelButton: true,
        data: null,
      },
    });
    const languageStore = useLanguageStore();
    return { state, languageStore };
  },
  data() {
    return {
      weatherData: null,
      hourlyForecast: [],
      weeklyForecast: [],
      additionalData: {},
      isLoading: false,
      currentCity: null,
      weatherIconUrl: '',
      isFavorite: false,
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
      currentTime: new Date(),
      timeInterval: null,
    };
  },
  computed: {
    formattedDateTime() {
      return formatDateTime(this.currentTime, this.$i18n.locale);
    },
  },
  mounted() {
    this.$i18n.locale = this.languageStore.locale;
    this.updateTime();
    this.timeInterval = setInterval(this.updateTime, 60000);
    this.loadWeatherData();
  },
  beforeUnmount() {
    if (this.timeInterval) clearInterval(this.timeInterval);
  },
  watch: {
    currentCity(newCity) {
      if (newCity && this.favorites.includes(newCity)) {
        this.isFavorite = true;
      } else {
        this.isFavorite = false;
      }
    },
    '$i18n.locale': {
      handler(newLocale) {
        if (this.weatherData) {
          this.loadWeatherData(); // Reload to update weekly forecast dates
        }
      },
    },
  },
  methods: {
    updateTime() {
      this.currentTime = new Date();
    },
    async loadWeatherData() {
      this.isLoading = true;
      let city = localStorage.getItem('lastCity');
      if (!city) {
        try {
          city = await getCityByIP();
        } catch (error) {
          city = 'Kyiv';
        }
      }
      this.currentCity = city;

      try {
        const weather = await weatherService.getCurrentWeather(city);
        this.weatherData = weather;
        this.weatherIconUrl = `https://openweathermap.org/img/wn/${weather.iconCode}@2x.png`;
        const rawForecast = await weatherService.getHourlyForecast(weather.coord.lat, weather.coord.lon);
        this.hourlyForecast = rawForecast
          .filter(item => item && item.main && typeof item.main.temp === 'number' && item.dt && Array.isArray(item.weather) && item.weather[0])
          .map(item => ({
            time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temp: Math.round(item.main.temp - 273.15),
            description: item.weather[0].description || 'N/A',
            iconCode: item.weather[0].icon || '',
          }));
        if (!this.hourlyForecast.length) {
          console.warn('Home: No valid hourly forecast data after filtering');
        }
        this.weeklyForecast = await weatherService.getWeeklyForecast(weather.coord.lat, weather.coord.lon, this.$i18n.locale);
        this.additionalData = await weatherService.getAdditionalData(city);
        localStorage.setItem('lastCity', city);
        this.isFavorite = this.favorites.includes(city);
      } catch (error) {
        console.error('Home: Error loading weather data:', error);
        this.weatherData = null;
        this.hourlyForecast = [];
        this.weatherIconUrl = '';
        this.$emit('error', 'Failed to load weather data');
      } finally {
        this.isLoading = false;
      }
    },
    getIconUrl(iconCode) {
      return iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : '';
    },
    toggleIsFavorite() {
      this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      if (this.favorites.includes(this.currentCity)) {
        this.isFavorite = false;
        this.favorites = this.favorites.filter(favCity => favCity !== this.currentCity);
      } else {
        if (this.favorites.length >= 5) {
          this.$emit('limit-exceeded', 'Maximum number of favorite cities reached');
          return;
        }
        this.isFavorite = true;
        this.favorites.unshift(this.currentCity);
      }
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    showAddCityModal() {
      this.state.modalState = {
        isVisible: true,
        type: 'add-city',
        confirmButtonText: '',
        cancelButtonText: '',
        showConfirmButton: false,
        showCancelButton: true,
        data: null,
      };
    },
    handleCitySelected(city) {
      localStorage.setItem('lastCity', city.name);
      this.currentCity = city.name;
      this.loadWeatherData();
      this.state.modalState.isVisible = false;
    },
    showErrorModal(message) {
      this.$emit('error', message);
    },
    handleModalConfirm() {
      this.state.modalState.isVisible = false;
    },
    handleModalCancel() {
      this.state.modalState.isVisible = false;
    },
  },
};
</script>

<style scoped>
.home-page {
  padding-bottom: 30px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.add-block-btn {
  width: fit-content;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  gap: 10px;
  margin-right: 0;
  margin-left: auto;
  color: white;
}

.weather-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.weather-section {
  background: white;
  border: 1px solid lightblue;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.weather-section:not(:first-child) {
  background: rgba(255, 255, 255, 0.8);
}

.weather-section h2 {
  margin: 0 0 10px;
  font-size: 24px;
}

.weather-card {
  width: 100%;
  border-radius: 20px;
  border: 1px solid lightblue;
  padding: 10px 20px;
  margin: 0 auto;
  background-color: white;
  overflow: hidden;
}

.weather-card__top {
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
}

.weather-card__btns button {
  width: 40px;
  height: 40px;
}

.weather-card__info {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  align-items: center;
  font-size: 25px;
  flex-wrap: wrap;
}

.weather-card__temp {
  font-size: 25px;
}
.weather-card__btn{
box-shadow: 0 2px 4px rgba(0, 255, 255, 0.573);

}
.weather-card__btn:hover{
color: aqua;

}
.weather-card.favorite .weather-card__btn {
  color: aqua;
  
}

.weather-card__datetime {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.2;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background: #f4f4f4;
}

td img {
  width: 40px;
  height: 40px;
}

.additional-data ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.additional-data li {
  padding: 5px 0;
  font-size: 16px;
}

.addition__point {
  color: rgb(242, 152, 50);
  font-size: 16px;
}

.error,
.no-data {
  text-align: center;
  color: red;
  padding: 20px;
}

.addition-info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  font-size: 14px;
  gap: 3px;
  color: #666;
  width: fit-content;
  align-self: last baseline;

}

.hourly-scroll {
  overflow-x: auto;
  padding-bottom: 10px;
}

.hourly-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: fit-content;
  padding: 10px;
  border-radius: 8px;
}

.hourly-times {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  font-size: 14px;
  color: #333;
}

.hourly-data {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.hourly-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 40px;
}

.hourly-item img {
  width: 40px;
  height: 40px;
}

.hourly-item span {
  display: inline-block;
  width: 40px;
  font-size: 14px;
  color: #333;
}

@media(max-width:560px) {
  .table__description {
    display: none;
  }
}
</style>