import { getWeatherByCity, getWeatherForecastByCoords } from "./weather";

const cache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const weatherService = {
  async getCurrentWeather(city) {
    const cacheKey = `current_${city}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
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
      cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error("WeatherService: Error fetching current weather:", error);
      throw error;
    }
  },

  async getHourlyForecast(lat, lon) {
    const cacheKey = `hourly_${lat}_${lon}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const forecast = await getWeatherForecastByCoords(lat, lon);
      const hourly = forecast.list.slice(0, 8).map((item) => ({
        dt: item.dt,
        time: new Date(item.dt * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temp: Math.round(item.main.temp - 273.15),
        humidity: item.main.humidity,
        description: item.weather[0]?.description || "N/A",
        iconCode: item.weather[0]?.icon || "",
      }));
      cache.set(cacheKey, { data: hourly, timestamp: Date.now() });
      return hourly;
    } catch (error) {
      console.error("WeatherService: Error fetching hourly forecast:", error);
      throw error;
    }
  },

  async getWeeklyForecast(lat, lon, locale = "en") {
    const cacheKey = `weekly_${lat}_${lon}_${locale}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const forecast = await getWeatherForecastByCoords(lat, lon);
      if (!forecast.list || !Array.isArray(forecast.list)) {
        throw new Error("Invalid forecast data");
      }

      const dailyData = new Map();
      const localeCode = locale === "uk" ? "uk-UA" : "en-US";
      const today = new Date().toLocaleDateString();

      // Группируем данные по дням
      for (const item of forecast.list) {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        // Пропускаем текущий день, если он неполный (менее 4 слотов)
        if (date === today && dailyData.get(date)?.temps?.length < 4) continue;
        if (!dailyData.has(date)) {
          dailyData.set(date, {
            temps: [],
            descriptions: [],
            icons: [],
            dateObj: new Date(item.dt * 1000),
          });
        }
        dailyData.get(date).temps.push(item.main.temp - 273.15); // В Цельсиях
        dailyData
          .get(date)
          .descriptions.push(item.weather[0]?.description || "N/A");
        dailyData.get(date).icons.push(item.weather[0]?.icon || "");
      }

      // Формируем недельный прогноз
      const daily = [];
      let count = 0;
      for (const [date, data] of dailyData) {
        if (count >= 7) break;
        // Пропускаем день, если недостаточно данных
        if (data.temps.length < 4) {
          console.warn(
            `Skipping day ${date}: insufficient data (${data.temps.length} slots)`
          );
          continue;
        }
        const minTemp = Math.round(Math.min(...data.temps));
        const maxTemp = Math.round(Math.max(...data.temps));
        // Берем описание и иконку из середины дня
        const midIndex = Math.floor(data.descriptions.length / 2);
        const description = data.descriptions[midIndex];
        const iconCode = data.icons[midIndex];

        daily.push({
          date: data.dateObj.toLocaleDateString(localeCode, {
            weekday: "short",
            day: "numeric",
            month: "short",
          }),
          minTemp,
          maxTemp,
          description,
          iconCode,
        });
        count++;
      }
      cache.set(cacheKey, { data: daily, timestamp: Date.now() });
      return daily;
    } catch (error) {
      console.error("WeatherService: Error fetching weekly forecast:", error);
      throw error;
    }
  },

  clearCache() {
    cache.clear();
  },
};
