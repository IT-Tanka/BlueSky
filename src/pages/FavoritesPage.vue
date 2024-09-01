<template>
    <main class="favorite-page">
        <div class="container">
            <div class="weather-blocks-container">
                <WeatherBlock v-for="(city, index) in weatherBlocks" :key="city" :city="city" @remove="removeBlock"
                    @request-remove="showModalForRemoval">
                </WeatherBlock>
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
            this.$root.showModalForRemoval(city, this.removeBlock);
        },
        removeBlock(city) {
            this.weatherBlocks = this.weatherBlocks.filter(blockCity => blockCity !== city);
            localStorage.setItem('favorites', JSON.stringify(this.weatherBlocks));
        },

    }
};
</script>
<style scoped>
.favorite-page {
    padding-top: 30px;
    padding-bottom: 30px;
}
</style>
