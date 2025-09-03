const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Запуск минимального сервера...');

// Проверяем токен
if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не найден!');
  console.log('📝 Создайте файл server/.env с содержанием:');
  console.log('BOT_TOKEN=ваш_токен_здесь');
  process.exit(1);
}

try {
  // Создаем бота
  const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: {
      interval: 300,
      autoStart: true,
      params: {
        timeout: 10
      }
    }
  });

  console.log('✅ Бот инициализирован');

  // Простейшая команда /start
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log('🎯 Получен /start от:', chatId);
    
    bot.sendMessage(chatId, 
      '🎉 Привет! Я работаю!\n\n' +
      'Отправь /test для проверки\n' +
      'Отправь любое сообщение для эха'
    ).catch(error => {
      console.error('❌ Ошибка отправки сообщения:', error.message);
    });
  });

  // Команда /test
  bot.onText(/\/test/, (msg) => {
    const chatId = msg.chat.id;
    console.log('✅ Тест от:', chatId);
    bot.sendMessage(chatId, '✅ Тест успешен! Бот работает!');
  });

  // Эхо-ответ на любое сообщение
  bot.on('message', (msg) => {
    if (msg.text && !msg.text.startsWith('/')) {
      const chatId = msg.chat.id;
      console.log('📨 Сообщение:', msg.text);
      bot.sendMessage(chatId, `Вы сказали: "${msg.text}"`);
    }
  });

  // Обработчики ошибок
  bot.on('polling_error', (error) => {
    console.error('🔴 Polling Error:', error.message);
    console.error('Код:', error.code);
  });

  bot.on('webhook_error', (error) => {
    console.error('🔴 Webhook Error:', error.message);
  });

  bot.on('error', (error) => {
    console.error('🔴 General Error:', error.message);
  });

  // Простой HTTP сервер
  app.get('/', (req, res) => {
    res.json({ 
      status: 'Bot is running',
      timestamp: new Date().toISOString()
    });
  });

  app.listen(PORT, () => {
    console.log(`🌐 HTTP сервер запущен на порту ${PORT}`);
    console.log(`🤖 Бот ожидает сообщений...`);
    console.log(`📝 Откройте Telegram и напишите /start вашему боту`);
  });

} catch (error) {
  console.error('❌ Не удалось запустить бота:');
  console.error('Сообщение:', error.message);
  console.error('Стек:', error.stack);
  process.exit(1);
}