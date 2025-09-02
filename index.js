// Загружаем переменные из .env файла
require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// ===== КОНФИГУРАЦИЯ =====
// Критически важно: токен берется из переменных окружения
const token = process.env.BOT_TOKEN;
const webhookUrl = process.env.WEBHOOK_URL;
const port = process.env.PORT || 3000;

// Создаем экземпляр Express.js приложения
const app = express();
// Инициализируем бота (пока без опроса)
const bot = new TelegramBot(token);

// ===== MIDDLEWARE =====
// Это нужно для корректного чтения JSON данных из запросов
app.use(express.json());

// ===== ФУНКЦИЯ ДЛЯ НАСТРОЙКИ ВЕБХУКА =====
async function setupWebhook() {
  try {
    // Формируем полный URL для вебхука
    const url = `${webhookUrl}/webhook`;
    console.log(`[Webhook] Пытаюсь установить вебхук на URL: ${url}`);

    // Сначала удаляем старый вебхук, если был
    await axios.get(`https://api.telegram.org/bot${token}/deleteWebhook`);

    // Устанавливаем новый вебхук
    // Параметр drop_pending_updates=true очищает очередь сообщений, которые могли накопиться
    const setWebhookUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${url}&drop_pending_updates=true`;
    const response = await axios.get(setWebhookUrl);

    console.log('[Webhook] Результат установки:', response.data);

    // Проверяем, что вебхук установился корректно
    const webhookInfo = await axios.get(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    console.log('[Webhook] Текущая информация:', webhookInfo.data);
  } catch (error) {
    console.error('[Webhook] Ошибка при настройке:', error.message);
  }
}

// ===== ОСНОВНЫЕ МАРШРУТЫ (ENDPOINTS) =====

// Маршрут для проверки работоспособности сервера
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Webhook server is running!',
    timestamp: new Date().toISOString()
  });
});

// Главный endpoint, куда Telegram будет присылать обновления
app.post('/webhook', async (req, res) => {
  try {
    const update = req.body;
    // console.log('Получено обновление:', update); // Для отладки

    // Обрабатываем только текстовые сообщения
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text;
      const userName = update.message.from.first_name || 'Друг';

      // Приводим текст к нижнему регистру для удобства проверки
      const lowerText = text.toLowerCase();

      // Обработка команды /start
      if (lowerText === '/start' || lowerText.startsWith('/start@')) {
        await bot.sendMessage(
          chatId, 
          `Здарова ебать, ${userName}! 🚀 Я твой братишка в этом чате!\n\nМного пиздеть не буду, но и молчать не собираюсь!` 
          // `Можешь нажать /fuck - пошлю кого-нибудь нахуй`
          // `Жми:\n` +
          // `/fuck - случайная шутка\n` +
          // `Напиши "скучно" - я предложу развлечение\n` +
          // `Напиши "кофе" - я поддержу кофепаузу`
        );
      } 

      // Обработка команды /fuck
      else if (lowerText === '/fuck' || lowerText.startsWith('/fuck@')) {
        const jokes = [
          "Почему программисты так плохо танцуют? У них нет алгоритмов!",
          "Что сказал один HTTP-запрос другому? Ты только не опять...",
          "Какой самый алкогольный язык программирования? Java-Script!",
          "Почему Python не пошел на вечеринку? Потому что у него слишком много зависимостей!",
          "Как называют программиста, который боится женщин? Гитхабофоб."
        ];

        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        await bot.sendMessage(chatId, randomJoke);
      }

      // Реакция на слово "пиво"
      else if (lowerText.includes('пив') || lowerText.includes('пиво') || lowerText.includes('пивн')) {
        const phrasesAboutBeer = [
          'я только подумал о пиве и тут на нахуй!',
          'пей пиво пенное — будет жизнь отменная!',
          'как говорит Жека Горловой - Саня насос пивной)',
          'лучше пиво в руке, чем девица вдалеке',
          'у человека всегда должно быть горячее сердце и холодное пиво!',
        ];

        const randomPhrase = phrasesAboutBeer[Math.floor(Math.random() * phrasesAboutBeer.length)];
        await bot.sendMessage(chatId, `${userName}, давай повеселимся! Введи команду /fuck`);
      }

      // Реакция на слово "кофе"
      else if (lowerText.includes('кофе') || lowerText.includes('кофий')) {
        await bot.sendMessage(chatId, '☕️ Бустим! Кофе - лучший друг программиста!');
      }

      // Реакция на любое другое сообщение (опционально)
      else {
        // Раскомментируй следующую строку, если хочешь, чтобы бот реагировал на все сообщения
        // await bot.sendMessage(chatId, `Привет, ${userName}! Я тебя услышал 👂`);
      }
    }

    // Всегда отвечаем OK, чтобы Telegram не пытался отправить запрос повторно
    res.status(200).send('OK');
    
  } catch (error) {
    console.error('Ошибка при обработке сообщения:', error);
    // Все равно отвечаем OK, чтобы не получить повторные запросы
    res.status(200).send('OK'); 
  }
});

// ===== ЗАПУСК СЕРВЕРА =====
app.listen(port, async () => {
  console.log(`[Server] Webhook-сервер запущен на порту ${port}`);
  
  // Устанавливаем вебхук только если указан внешний URL
  if (webhookUrl && webhookUrl.startsWith('http')) {
    await setupWebhook();
  } else {
    console.log('[Info] Webhook URL не указан. Режим разработки.');
  }
});

// ===== ГРАЦИОЗНОЕ ЗАВЕРШЕНИЕ РАБОТЫ =====
// Важно для корректной работы на Render
process.on('SIGTERM', () => {
  console.log('Получен SIGTERM. Грациозное завершение работы...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Получен SIGINT. Грациозное завершение работы...');
  process.exit(0);
});