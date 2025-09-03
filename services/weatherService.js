const { OpenWeatherAPI } = require("openweather-api-node");

class WeatherService {
  constructor() {
    this.weather = new OpenWeatherAPI({
      key: process.env.OPENWEATHER_API_KEY,
      units: "metric" // Используем метрическую систему (Цельсий)
    });
  }

  // Установка локации по названию города
  setLocation(cityName) {
    this.weather.setLocationByName(cityName);
  }

  // Получение текущей погоды
  async getCurrentWeather(cityName) {
    try {
      this.setLocation(cityName);
      const data = await this.weather.getCurrent();
      console.log(data)
      
      return {
        temperature: data.weather.temp.cur,
        feelsLike: data.weather.feelsLike.cur,
        description: data.weather.description,
        humidity: data.weather.humidity,
        windSpeed: data.weather.wind.speed,
        city: cityName,
      };
    } catch (error) {
      console.error('Weather API Error:', error);
      throw new Error('Не удалось получить данные о погоде. Проверь название города.');
    }
  }
}

module.exports = new WeatherService();