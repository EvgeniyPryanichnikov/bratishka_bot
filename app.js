const express = require('express');
const config = require('./config');
const { setupWebhook } = require('./utils/helpers');
const { handleMessage } = require('./bot');

const app = express();
app.use(express.json());

// Маршрут для проверки работы
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Webhook server is running!',
    timestamp: new Date().toISOString()
  });
});

// Вебхук от Telegram
app.post('/webhook', async (req, res) => {
  try {
    await handleMessage(req.body);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(200).send('OK');
  }
});

// Запуск сервера
app.listen(config.port, async () => {
  console.log(`[Server] Сервер запущен на порту ${config.port}`);
  
  // Настройка вебхука для продакшена
  if (config.webhookUrl && config.webhookUrl.startsWith('http')) {
    await setupWebhook(config.token, config.webhookUrl);
  } else {
    console.log('[Info] Режим разработки');
  }
});

// Корректное завершение работы
process.on('SIGTERM', () => {
  console.log('SIGTERM - Завершение работы...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT - Завершение работы...');
  process.exit(0);
});