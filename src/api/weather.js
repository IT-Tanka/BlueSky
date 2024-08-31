import axios from 'axios';

const API_KEY = '3b81110d8238007cf870d09fa4382efd';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getWeatherByCity(city) {
    const response = await axios.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}`);
    return response.data;
}

export async function getCity(city) {
    const response = await axios.get(`${BASE_URL}/find?q=${city}&type=like&appid=${API_KEY}`);
    return response.data;
}

export async function getWeatherForecastByCoords(lat, lon) {
    const response = await axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    return response.data;
}

export async function getCityByIP() {
    const response = await axios.get('https://ipapi.co/json/');
    return response.data.city;
    
}
