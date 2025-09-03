// Вспомогательные функции, Утилиты и хелперыconst axios = require('axios');
const axios = require('axios');

// Настройка вебхука
async function setupWebhook(token, webhookUrl) {
  try {
    const url = `${webhookUrl}/webhook`;
    console.log(`[Webhook] Устанавливаю вебхук на URL: ${url}`);

    await axios.get(`https://api.telegram.org/bot${token}/deleteWebhook`);
    
    const setWebhookUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${url}&drop_pending_updates=true`;
    const response = await axios.get(setWebhookUrl);

    console.log('[Webhook] Результат:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Webhook] Ошибка:', error.message);
    throw error;
  }
}

// Случайный элемент из массива
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Обработка Instagram ссылок
function processInstagramLink(text) {
  if (text.includes('instagram.com/') || text.includes('www.instagram.com/')) {
    return text.replace(/instagram\.com/g, 'ddinstagram.com');
  }
  return null;
}

module.exports = {
  setupWebhook,
  getRandomItem,
  processInstagramLink
};