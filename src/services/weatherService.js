import { getWeatherByCity, getWeatherForecastByCoords } from './weather';

const cache = new Map();

export const weatherService = {
  async getCurrentWeather(city) {
    const cacheKey = `current_${city}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const weather = await getWeatherByCity(city);
      const data = {
        cityName: weather.name,
        temp: Math.round(weather.main.temp - 273.15),
        description: weather.weather[0].description,
        iconCode: weather.weather[0].icon,
        humidity: weather.main.humidity,
        pressure: weather.main.pressure,
        windSpeed: weather.wind.speed,
        coord: weather.coord,
      };
      cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('WeatherService: Error fetching current weather:', error);
      throw error;
    }
  },

  async getHourlyForecast(lat, lon) {
    const cacheKey = `hourly_${lat}_${lon}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const forecast = await getWeatherForecastByCoords(lat, lon);
      const hourly = forecast.list.slice(0, 8).map(item => ({
        dt: item.dt,
        main: { temp: item.main.temp },
        weather: item.weather,
      }));
      cache.set(cacheKey, hourly);
      return hourly;
    } catch (error) {
      throw error;
    }
  },

  async getWeeklyForecast(lat, lon, locale = 'en') {
    const cacheKey = `weekly_${lat}_${lon}_${locale}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const forecast = await getWeatherForecastByCoords(lat, lon);
      const daily = [];
      const seenDates = new Set();
      const localeCode = locale === 'uk' ? 'uk-UA' : 'en-US';
      for (const item of forecast.list) {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!seenDates.has(date) && daily.length < 7) {
          seenDates.add(date);
          daily.push({
            date: new Date(item.dt * 1000).toLocaleDateString(localeCode, {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            }),
            temp: Math.round(item.main.temp - 273.15),
            description: item.weather[0].description,
            iconCode: item.weather[0].icon,
          });
        }
        if (daily.length >= 7) break;
      }
      cache.set(cacheKey, daily);
      return daily;
    } catch (error) {
      throw error;
    }
  },

  async getAdditionalData(city) {
    try {
      const weather = await this.getCurrentWeather(city);
      return {
        humidity: weather.humidity,
        pressure: weather.pressure,
        windSpeed: weather.windSpeed,
      };
    } catch (error) {
      console.error('WeatherService: Error fetching additional data:', error);
      throw error;
    }
  },

  clearCache() {
    cache.clear();
  },
};