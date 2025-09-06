// Обработка ключевых слов
const { getRandomItem } = require('../utils/helpers');

// Ответы на ключевые слова
const responses = {
  погода: [
    { text: 'Сейчас гляну что там по погоде... 🌤️', action: 'getWeather' }
  ],

  пиво: [
    'я только подумал о пиве и тут на нахуй!',
    'пей пиво пенное — будет жизнь отменная!',
    'как говорит Жека Горловой - Саня насос пивной)',
    'лучше пиво в руке, чем девица вдалеке',
    'у человека всегда должно быть горячее сердце и холодное пиво!',
  ],

  кремпай: [
    'Я и есть кремпай!',
    'Это моё имя, имей уважение',
    'ну чего ебать?'
  ],

  серёга: [
    'Трофим конечно легенда..'
  ],

  геллерт: [
    'Геллерт конечно для петухов, но можно и сгонять на пару кружек',
    'бля, как вас не заебал ещё этот геллерт',
    'кстати, у Сани в геллерте по понедельникам одинокие бабы сидят',
    'что-то тоже захотелось в Геллерт...',
  ],

  ['и хули']: [
    'А бля, сорян пацаны! пока вы все проебались - я помню!\n🍻сегодня др у кента вашего - Сани!🍾\nобнимите его от меня по-крепче!\nСаша, желаю тебе быть счастливым, богатым, ебать красивейших женщин!\nне забывай любить пиво и с моим хозяином пить пиратский ром!🥃\n\nВ общем, за нас с вами за хуй с ними, все тестировщики пидарасы!😅👨🏼‍🤝‍👨🏼'
  ]
};

// Поиск ключевых слов в тексте
function findKeyword(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('погода') || lowerText.includes('погоду') || lowerText.includes('погодка')) return 'погода';
  if (lowerText.includes('пив')) return 'пиво';
  if (lowerText.includes('кремпай')) return 'кремпай';
  if (lowerText.includes('серёга') || lowerText.includes('сер') || lowerText.includes('троф')) return 'серёга';
  if (lowerText.includes('геллерт') || lowerText.includes('гел') || lowerText.includes('геля')) return 'геллерт';
  if (lowerText.includes('и хули')) return 'и хули';
  
  return null;
}

// Обработка найденного ключевого слова
function handleKeyword(keyword, userName) {
  const responseArray = responses[keyword];
  if (!responseArray) return null;

  const response = getRandomItem(responseArray);
  return keyword === 'кремпай' ? `${response}, ${userName}` : response;
}

module.exports = {
  findKeyword,
  handleKeyword
};