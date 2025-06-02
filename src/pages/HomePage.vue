<template>
  <div class="home-page">
    <div class="container">
      <button class="add-block-btn" @click.stop="showAddCityModal">
        <span>{{ $t('Add City') }}</span>
        <IconAddBlock />
      </button>
      <Preloader v-if="isLoading" :visible="isLoading" />
      <div v-else-if="weatherData" class="weather-sections">
        <div :class="['weather-card', { favorite: isFavorite }]">
          <button :disabled="isLoading" class="weather-card__btn" @click="toggleIsFavorite">
                 <IconIsFavorite :is-active="isFavorite" />
            </button>
            <p class="weather-card__datetime">{{ formattedDateTime }}</p>
          <div class="weather-card__info">
            <h2>{{ weatherData.cityName }}</h2>
            <img :src="weatherIconUrl" :alt="weatherData.description || 'weather icon'" />
            <p class="weather-card__temp">{{ weatherData.temp }} °C</p>
            <ul class="addition-info">
              <li class="addition__point">
                <span class="addition__point-title">{{ $t('Humidity') }}:</span>
                <span class="addition__point-value">{{ weatherData.humidity }}%</span>
                <IconHumidity />
              </li>
              <li class="addition__point">
                <span class="addition__point-title">{{ $t('Pressure') }}:</span>
                <span class="addition__point-value">{{ weatherData.pressure }}hPa</span>
                <IconPressure />
              </li>
              <li class="addition__point">
                <span class="addition__point-title">{{ $t('Wind Speed') }}:</span>
                <span class="addition__point-value">{{ weatherData.windSpeed }}m/s</span>
                <IconWind />
              </li>
            </ul>
          </div>
        </div>
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
          <p v-else class="no-data error">{{ $t('No hourly data available') }}</p>
        </div>
        <div class="weather-section weekly-forecast">
          <h2>{{ $t('Weekly Forecast') }}</h2>
          <table>
            <tbody>
              <tr v-for="item in weeklyForecast" :key="item.date">
                <td>{{ item.date }}</td>
                <td>{{ item.temp }} °C</td>
                <td class="table__description">{{ translatedDescriptions[item.description] || item.description }}</td>
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
        <div v-else-if="state.modalState.type === 'error'">{{ state.modalState.data.message }}</div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { reactive, computed } from 'vue';
import { useLanguageStore } from '../stores/language';
import { useFavoritesStore } from '../stores/favorites';
import IconAddBlock from '../components/icons/IconAddBlock.vue';
import IconIsFavorite from '../components/icons/IconIsFavorite.vue';
import IconHumidity from '../components/icons/IconHumidity.vue';
import IconWind from '../components/icons/IconWind.vue';
import IconPressure from '../components/icons/IconPressure.vue';
import CityInput from '../components/CityInput.vue';
import Modal from '../components/Modal.vue';
import Preloader from '../components/Preloader.vue';
import { weatherService } from '../services/weatherService';
import { getCityByIP } from '../services/weather';
import { formatDateTime } from '../utils/formatDate';

export default {
  components: {
    IconAddBlock,
    IconIsFavorite,
    IconHumidity,
    IconWind,
    IconPressure,
    CityInput,
    Modal,
    Preloader,
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
    const favoritesStore = useFavoritesStore();  
    return { state, languageStore, favoritesStore };
  },
  data() {
    return {
      weatherData: null,
      hourlyForecast: [],
      weeklyForecast: [],
      isLoading: false,
      currentCity: null,
      weatherIconUrl: '',
      isFavorite: false,
      currentTime: new Date(),
      timeInterval: null,
      translatedDescriptions: {},
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
    setInterval(() => weatherService.clearCache(), 30 * 60 * 1000);
  },
  beforeUnmount() {
    if (this.timeInterval) clearInterval(this.timeInterval);
  },
  watch: {
    currentCity(newCity) {
      this.isFavorite = this.favoritesStore.isFavorite(newCity);
    },
    '$i18n.locale': {
      handler(newLocale) {
        if (this.weatherData) {
          this.updateWeeklyForecastDates(newLocale);
          this.updateTranslatedDescriptions();
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
        this.updateTranslatedDescriptions();
        localStorage.setItem('lastCity', city);
        this.isFavorite = this.favoritesStore.isFavorite(city);
      } catch (error) {
        console.error('Home: Error loading weather data:', error);
        this.weatherData = null;
        this.hourlyForecast = [];
        this.weatherIconUrl = '';
        this.showErrorModal(error.message || 'Failed to load weather data');
      } finally {
        this.isLoading = false;
      }
    },
    async updateWeeklyForecastDates(locale) {
      try {
        const weekly = await weatherService.getWeeklyForecast(
          this.weatherData.coord.lat,
          this.weatherData.coord.lon,
          locale
        );
        this.weeklyForecast = weekly;
      } catch (error) {
        console.error('Home: Error updating weekly forecast dates:', error);
        this.showErrorModal(error.message || 'Failed to update weekly forecast');
      }
    },
    updateTranslatedDescriptions() {
      this.translatedDescriptions = {};
      [...this.hourlyForecast, ...this.weeklyForecast].forEach(item => {
        if (item.description && item.description !== 'N/A') {
          this.translatedDescriptions[item.description] = this.$t(item.description);
        }
      });
    },
    getIconUrl(iconCode) {
      return iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : '';
    },
    toggleIsFavorite() {
      if (this.isFavorite) {
        this.favoritesStore.removeFavorite(this.currentCity);
        this.isFavorite = false;
      } else {
        const success = this.favoritesStore.addFavorite(this.currentCity);
        if (!success) {
          this.showErrorModal('Maximum number of favorite cities reached');
          return;
        }
        this.isFavorite = true;
      }
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
      this.state.modalState = {
        isVisible: true,
        type: 'error',
        confirmButtonText: 'OK',
        cancelButtonText: '',
        showConfirmButton: true,
        showCancelButton: false,
        data: { message },
      };
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


<style lang="scss" scoped>
.home-page {
  padding-bottom: $spacing-xxl;
  min-height: 100vh;
}

.add-block-btn {
  width: fit-content;
  padding: $spacing-lg;
  @include flex-center;
  font-size: $font-size-sm;
  gap: $spacing-md;
  color: $white;
  @include transition(background-color);

  @media (max-width: 560px) {
    padding: $spacing-md;

    span {
      display: none;
    }
  }
}

.weather-sections {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.weather-section {
  @include card;

  &:not(:first-child) {
    background: rgba($white, 0.8);
  }

  h2 {
    margin: $spacing-sm 0 $spacing-xl $spacing-lg;
    font-size: 22px;
    min-height: 32px;
    line-height: 32px;
  }

  &.hourly-forecast {
    .hourly-scroll {
      overflow-x: auto;
      padding-bottom: $spacing-md;
    }

    .hourly-card {
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
      min-width: fit-content;
      padding: $spacing-md;
      border-radius: $border-radius-md;
    }

    .hourly-times {
      display: flex;
      gap: $spacing-xl;
      justify-content: space-between;
      font-size: $font-size-lg;
      color: #333;

      span {
        display: inline-block;
        min-width: 80px;
        text-align: center;
      }
    }

    .hourly-data {
      display: flex;
      gap: $spacing-xl;
      justify-content: space-between;
    }

    .hourly-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      min-width: 80px;

      img {
        width: 80px;
        height: 80px;
      }

      span {
        display: inline-block;
        width: 80px;
        font-size: $font-size-lg;
        color: #333;
        text-align: center;
      }
    }
  }

  &.weekly-forecast {
    table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: 0 $spacing-md;
        text-align: center;
        border-bottom: 1px solid $light-gray;
        min-height: 50px;
        line-height: 50px;
      }

      th {
        background: $background-gray;
      }

      td img {
        width: 80px;
        height: 80px;
      }

      .table__description {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        @media (max-width: 560px) {
          display: none;
        }
      }
    }
  }
}

.weather-card {
  &:first-child {
    background-color: rgba($white, 0.2);
    border: 1px solid rgba($light-blue, 0.454);
  }
}

.addition-info {
  @include flex-center;
  margin-left: auto;
  font-size: $font-size-md;
  gap: 8px;
  color: $gray;
  width: fit-content;
  align-self: last baseline;

  li {
    @include flex-center;
  }

  .addition__point {
    color: $secondary-accent;
    font-size: $font-size-lg;
  }

  .addition__point-value {
    color: #333;
  }

  #Capa_1 {
    margin-left: 3px;
  }

  @media (max-width: 560px) {
    .addition__point-title {
      display: none;
    }

    .addition__point-value {
      color: $secondary-accent;
      font-weight: 500;
    }
  }
}
</style>
