<template>
  <div class="city-input__block" ref="cityInputBlock">
    <input type="text" v-model="query" @input="fetchCities" @focus="addHightoList" @keydown="handleKeydown"
      :placeholder="$t('Enter city')" ref="input" />
    <ul ref="citiesList" v-if="cities.length > 0">
      <li v-for="(city, index) in cities" :key="city.id" @click="selectCity(city)"
        :class="{ 'selected': index === selectedIndex }">
        {{ city.name }}, {{ city.sys.country }}
      </li>
    </ul>
  </div>
</template>

<script>
import { getCity } from '../services/weather';

export default {
  data() {
    return {
      query: '',
      cities: [],
      selectedIndex: -1,
      fetchCitiesDebounced: this.debounce(this.fetchCitiesApi, 300),
      isMounted: false, 
    };
  },
  emits: ['city-selected', 'cancel', 'error'],
  methods: {
    debounce(func, wait) {
      let timeout;
      return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
      };
    },
    async fetchCities() {
      if (this.query.length < 3) {
        this.cities = [];
        this.selectedIndex = -1;
        return;
      }
      this.fetchCitiesDebounced();
    },
    async fetchCitiesApi() {
      if (this.query.length < 3) {
        this.cities = [];
        this.selectedIndex = -1;
        return;
      }
      try {
        const response = await getCity(this.query);
        this.cities = response.list;
        this.selectedIndex = -1;
      } catch (error) {
        console.error('CityInput: Error loading cities:', error);
        this.$emit('error', this.$t('errorLoadingCities'));
      }
    },
    selectCity(city) {
      this.$emit('city-selected', city);
      this.query = `${city.name}, ${city.sys.country}`;
      this.cities = [];
      this.selectedIndex = -1;
    },
    handleKeydown(event) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (this.selectedIndex < this.cities.length - 1) {
          this.selectedIndex++;
          this.scrollToSelected();
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (this.selectedIndex > 0) {
          this.selectedIndex--;
          this.scrollToSelected();
        }
      } else if (event.key === 'Enter' && this.selectedIndex >= 0) {
        event.preventDefault();
        this.selectCity(this.cities[this.selectedIndex]);
      } else if (event.key === 'Escape') {
        this.$emit('cancel');
      }
    },
    scrollToSelected() {
      if (this.$refs.citiesList && this.selectedIndex >= 0) {
        const selectedItem = this.$refs.citiesList.children[this.selectedIndex];
        selectedItem.scrollIntoView({ block: 'nearest' });
      }
    },
    handleClickOutside(event) {
      if (!this.isMounted) return;
      if (this.$refs.cityInputBlock && !this.$refs.cityInputBlock.contains(event.target)) {
        this.$emit('cancel');
        this.cities = [];
        this.selectedIndex = -1;
        if (this.$refs.citiesList) {
          this.$refs.citiesList.style = 'height:0px; overflow:hidden;';
        }
      }
    },
    addHightoList() {
      if (this.$refs.citiesList) {
        this.$refs.citiesList.style.height = 'fit-content';
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.$refs.input.focus();
    setTimeout(() => {
      this.isMounted = true;
    }, 100);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>

<style scoped>
.city-input__block {
  position: relative;
  margin: 20px auto;
  width: fit-content;
}

input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid lightblue;
  border-radius: 5px;
  width: 250px;
}

ul {
  position: absolute;
  left: 0;
  top: 100%;
  background-color: white;
  border: 1px solid lightblue;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

li {
  cursor: pointer;
  padding: 5px 10px;
  border-bottom: 1px solid #eee;
}

li:last-child {
  border-bottom: none;
}

li.selected {
  background-color: #f0f8ff;
}

li:hover {
  background-color: #e6f0fa;
}
</style>