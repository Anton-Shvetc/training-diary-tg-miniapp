const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

console.log('🔍 Проверка токена бота...');
console.log('Токен из .env:', process.env.BOT_TOKEN ? 'Есть' : 'Отсутствует');

if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не найден в .env файле');
  process.exit(1);
}

async function testBot() {
  try {
    console.log('🔄 Подключаемся к Telegram API...');
    
    const bot = new TelegramBot(process.env.BOT_TOKEN, { 
      polling: true,
      onlyFirstMatch: true
    });

    // Простая команда для проверки
    bot.onText(/\/test/, (msg) => {
      const chatId = msg.chat.id;
      console.log('✅ Получена команда /test от:', msg.chat.id);
      bot.sendMessage(chatId, '🤖 Бот работает! Тест успешен!');
    });

    bot.on('message', (msg) => {
      console.log('📨 Получено сообщение:', msg.text, 'от', msg.chat.id);
    });

    bot.on('polling_error', (error) => {
      console.error('❌ Ошибка polling:', error.message);
    });

    bot.on('error', (error) => {
      console.error('❌ Общая ошибка бота:', error.message);
    });

    // Проверяем информацию о боте
    setTimeout(async () => {
      try {
        const me = await bot.getMe();
        console.log('✅ Бот подключен успешно:');
        console.log('   Имя:', me.first_name);
        console.log('   Username:', me.username);
        console.log('   ID:', me.id);
        console.log('\n📝 Отправьте команду /test вашему боту в Telegram');
      } catch (error) {
        console.error('❌ Ошибка при получении информации о боте:');
        console.error('   Сообщение:', error.message);
        console.error('   Код:', error.response?.statusCode);
      }
    }, 2000);

  } catch (error) {
    console.error('❌ Критическая ошибка:');
    console.error(error.message);
    process.exit(1);
  }
}

testBot();