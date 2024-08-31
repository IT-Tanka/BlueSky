<template>
    <div class="city-input__block">
        <input type="text" v-model="query" @input="fetchCities" :placeholder="$t('Enter city')" />
        <ul v-if="cities.length > 0">
            <li v-for="city in cities" :key="city.id" @click="selectCity(city)">
                {{ city.name }}, {{ city.sys.country }}
            </li>
        </ul>
    </div>
</template>

<script>
import { getCity } from '../api/weather';

export default {
    data() {
        return {
            query: '',
            cities: [],
        };
    },
    methods: {
        async fetchCities() {
            if (this.query.length < 3) {
                this.cities = [];
                return;
            }
            try {
                const response = await getCity(this.query);
                this.cities = response.list;
            } catch (error) {
                console.error('Ошибка при загрузке городов:', error);
            }
        },
        selectCity(city) {
            this.$emit('city-selected', city);
            this.query = `${city.name}, ${city.sys.country}`;
            this.cities = [];
        }
    }
};
</script>
<style scoped>

.city-input__block{
    position: relative;
    margin-top: 20px;
    margin-bottom: 10px;
    width: fit-content;
    margin-left: auto;
}
ul{
    position:absolute;
    left: 0;
    top:30px;
    background-color: white;
    border:1px solid lightblue;
    width: 100%;

}
li{
    cursor: pointer;
    padding: 3px 5px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
}
</style>