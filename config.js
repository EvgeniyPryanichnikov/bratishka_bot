require('dotenv').config();

module.exports = {
  token: process.env.BOT_TOKEN,
  webhookUrl: process.env.WEBHOOK_URL,
  port: process.env.PORT || 3000
};