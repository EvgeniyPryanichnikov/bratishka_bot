 // Обработка команд (/start, /hi)
 const { getRandomItem } = require('../utils/helpers');

// Обработка команды /start
function handleStart(userName) {
  return `Здарова ебать, ${userName}! 🚀 Я твой братишка в этом чате!\n\n` +
         `Много пиздеть не буду, но и молчать не собираюсь!\n\n` +
         `Придётся меня потерпеть, пока Жека Горловой меня научит чему-то толковому!\n\n` +
         `Можешь нажать /hi - я пошлю кого-нибудь нахуй 💖\n\n` +
         `Кинь мне ссылку на рилс из инсты - я отформатирую её для тг ✔` + 
         `это тест нахой и он работает!`
}

// Обработка команды /hi
function handleHi(userName) {
  return `Хорошего дня, ${userName}!\nи иди нахуй! 👌`;
}

module.exports = {
  handleStart,
  handleHi
};