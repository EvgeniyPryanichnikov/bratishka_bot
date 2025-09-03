const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const { processInstagramLink } = require('./utils/helpers');
const { handleStart, handleHi, handleWeather } = require('./handlers/commands');
const { findKeyword, handleKeyword } = require('./handlers/keywords');

const bot = new TelegramBot(config.token);

// Главный обработчик сообщений
async function handleMessage(update) {
  if (!update.message || !update.message.text) return;

  const { chat, text, from } = update.message;
  const userName = from.first_name || 'Друг';
  const lowerText = text.toLowerCase();

  try {
    // Обработка команд
    if (lowerText === '/start' || lowerText.startsWith('/start@')) {
      const message = handleStart(userName);
      await bot.sendMessage(chat.id, message);
      return;
    }

    if (lowerText === '/hi' || lowerText.startsWith('/hi@')) {
      const message = handleHi(userName);
      await bot.sendMessage(chat.id, message);
      return;
    }

    // Обработка Instagram ссылок
    const instagramLink = processInstagramLink(text);
    if (instagramLink) {
      await bot.sendMessage(chat.id, instagramLink);
      await bot.sendMessage(chat.id, 'ссылка для тг готова, но хз сработает или нет 😎');
      return;
    }

    // Обработка ключевых слов
    const keyword = findKeyword(text);
    if (keyword) {
      const message = handleKeyword(keyword, userName);
      if (message) {
        await bot.sendMessage(chat.id, message);
        return;
      }
    }

    // Обработка команды /weather
    if (lowerText.startsWith('/weather')) {
      const city = text.split(' ')[1] || 'Самара'; // По умолчанию Самара
      const message = await handleWeather(userName, city);
      await bot.sendMessage(chat.id, message);
      return;
    }

    // Обработка команды /forecast
    if (lowerText.startsWith('/forecast')) {
      const city = text.split(' ')[1] || 'Самара'; // По умолчанию Самара
      const message = await handleForecast(userName, city);
      await bot.sendMessage(chat.id, message);
      return;
    }

    // Можно добавить реакцию на другие сообщения
    // await bot.sendMessage(chat.id, `Привет, ${userName}! Я тебя услышал 👂`);

  } catch (error) {
    console.error('Ошибка обработки сообщения:', error);
  }
}

module.exports = {
  bot,
  handleMessage
};