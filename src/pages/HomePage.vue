<template>
    <main class="home-page">
        <div class="container">
            <button class="add-block-btn" :disabled="weatherBlocks.length > 5" @click="addBlock">
                <IconAddBlock /> {{ $t("Add Weather Block") }}
            </button>
            <div class="weather-blocks-container">
                <WeatherBlock v-for="(city, index) in weatherBlocks" :key="city" :city="city" @remove="removeBlock"
                    @request-remove="showModalForRemoval" @limit-exceeded="showLimitExceededModal">
                    <template #city-input>
                        <CityInput @city-selected="selectCity(index, $event)" />
                    </template>
                </WeatherBlock>
            </div>
        </div>
        <ModalLimitExceeded v-if="isLimitExceeded" @confirm="handleLimitExceeded" @cancel="closeModal" />
    </main>
</template>

<script>
import WeatherBlock from '../components/WeatherBlock.vue';
import IconAddBlock from '../components/icons/IconAddBlock.vue';
import CityInput from '../components/CityInput.vue';
import ModalLimitExceeded from '../components/ModalLimitExceeded.vue'
import { getCityByIP } from '../api/weather';

export default {
    components: {
        WeatherBlock,
        IconAddBlock,
        CityInput,
        ModalLimitExceeded 
    },
    data() {
        return {
            weatherBlocks: [],
            isLimitExceeded: false,
        };
    },
    async mounted() {
        let city;
        try {
            city = await getCityByIP();
        } catch (error) {
            console.error('Error retrieving weather data:', error);
        } finally {
            if (!city) city = 'Kyiv';
            this.weatherBlocks.unshift(city);
        }
    },
    methods: {
        selectCity(index, city) {
            this.weatherBlocks[index] = city.name;
        },

        updateCity(index, city) {
            this.weatherBlocks[index] = city.name;
            alert();
        },

        addBlock() {
            const newCity = '';
            this.weatherBlocks.unshift(newCity);
        },

        showModalForRemoval(city) {
            this.$root.showModalForRemoval(city, this.removeBlock);
        },

        showLimitExceededModal() { 
            this.isLimitExceeded = true;
        },

        handleLimitExceeded() {
            this.isLimitExceeded = false;
        },

        closeModal() {
            this.isLimitExceeded = false;
        },

        removeBlock(city) {
            this.weatherBlocks = this.weatherBlocks.filter(blockCity => blockCity !== city);

        },
    }
};
</script>
<style csoped>
.home-page {
    padding-bottom: 30px;
}

.add-block-btn {
    width: fit-content;
    padding: 10px;
    margin: 30px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    gap: 10px;
}
</style>
