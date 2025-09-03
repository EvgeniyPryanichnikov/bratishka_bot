 // Обработка команд (/start, /hi)
 const { getRandomItem } = require('../utils/helpers');
 const weatherService = require('../services/weatherService');

// Обработка команды /start
function handleStart(userName) {
  return `Здарова ебать, ${userName}! 🚀 Я твой братишка в этом чате!\n\n` +
         `Много пиздеть не буду, но и молчать не собираюсь!\n\n` +
         `Придётся меня потерпеть, пока Жека Горловой меня научит чему-то толковому!\n\n` +
         `✌️ Доступные команды:\n` +
         `/hi - пошлю кого-нибудь нахуй\n` +
         `/weather - прогноз погоды в Самаре\n` +
         `/weather + [твой город] - прогноз погоды в [твоём городе]\n\n` +
         `Кинь мне ссылку на рилс из инсты - я отформатирую её для тг ✔`;
}

// Обработка команды /hi
function handleHi(userName) {
  return `Хорошего дня, ${userName}!\nи иди нахуй! 👌`;
}

// Новая команда для текущей погоды
async function handleWeather(userName, city = 'Самара') {
  try {
    const weather = await weatherService.getCurrentWeather(city);
    
    return `🌤️ В городе ${weather.city} сейчас:\n\n` +
           `🌡️ Температура: ${weather.temperature}°C\n` +
           `🤷‍♂️(ощущается как ${weather.feelsLike}°C)\n` +
           `💧 Влажность: ${weather.humidity}%\n` +
           `💨 Ветер: ${weather.windSpeed} м/с\n\n` +
           `Хорошего дня, ${userName}! 🍻`;
  } catch (error) {
    return `❌ ${error.message}\n\nПопробуй: /weather Самара`;
  }
}

module.exports = {
  handleStart,
  handleHi,
  handleWeather
};