const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

console.log('🚀 Запуск Telegram Mini App Server...');

// Проверка токена
if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не найден в .env файле');
  process.exit(1);
}

// Инициализация бота
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

// ================== ОБРАБОТЧИКИ КОМАНД БОТА ==================

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.chat.first_name || 'пользователь';
  
  console.log('🎯 Получен /start от:', chatId);

  const welcomeMessage = 
    `👋 Привет, ${firstName}!\n` +
    `Добро пожаловать в Mini App!\n\n` +
    `🎯 Доступные команды:\n` +
    `• /start - начать работу\n` +
    `• /menu - открыть меню\n` +
    `• /help - помощь\n\n` +
    `📱 Нажми на кнопку ниже чтобы открыть приложение!`;

  bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: {
      inline_keyboard: [
        [{
          text: '🚀 Открыть приложение',
          web_app: { url: process.env.WEB_APP_URL || 'http://localhost:3000' }
        }]
      ]
    }
  }).catch(error => {
    console.error('❌ Ошибка отправки сообщения:', error.message);
  });
});

// Команда /menu
bot.onText(/\/menu/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, '📱 Меню приложения:', {
    reply_markup: {
      keyboard: [
        [{ text: '🎯 Открыть приложение', web_app: { url: process.env.WEB_APP_URL } }],
        [{ text: 'ℹ️ Помощь' }, { text: '⚙️ Настройки' }]
      ],
      resize_keyboard: true
    }
  });
});

// Команда /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = 
    `🤖 **Справка по боту**\n\n` +
    `**Команды:**\n` +
    `• /start - начать работу\n` +
    `• /menu - открыть меню\n` +
    `• /help - эта справка\n\n` +
    `**Web App:**\n` +
    `• Интерактивные кнопки\n` +
    `• Уведомления\n` +
    `• Отправка данных\n\n` +
    `💡 Просто напишите мне что-нибудь!`;

  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// Обработка обычных сообщений
bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    const chatId = msg.chat.id;
    console.log('📨 Сообщение от', chatId, ':', msg.text);
    
    bot.sendMessage(chatId, 
      `📝 Вы сказали: "${msg.text}"\n\n` +
      `Попробуйте команду /menu для открытия приложения!`
    );
  }
});

// ================== API МАРШРУТЫ ==================

// Отправка сообщения через API
app.post('/api/send-message', async (req, res) => {
  try {
    const { chatId, text } = req.body;
    
    if (!chatId || !text) {
      return res.status(400).json({ 
        success: false, 
        error: 'Требуются chatId и text' 
      });
    }
    
    const result = await bot.sendMessage(chatId, text);
    res.json({ success: true, result });
    
  } catch (error) {
    console.error('❌ Ошибка отправки сообщения:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Получение информации о боте
app.get('/api/bot-info', async (req, res) => {
  try {
    const botInfo = await bot.getMe();
    res.json({ 
      success: true, 
      bot: {
        name: botInfo.first_name,
        username: botInfo.username,
        id: botInfo.id
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Telegram Mini App Server'
  });
});

// Webhook для данных из WebApp
app.post('/api/webhook', (req, res) => {
  try {
    const data = req.body;
    console.log('📦 Данные от WebApp:', data);
    
    res.json({ 
      success: true, 
      message: 'Данные получены',
      data: data 
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ================== ОБРАБОТЧИКИ ОШИБОК ==================

bot.on('polling_error', (error) => {
  console.error('🔴 Polling Error:', error.message);
});

bot.on('error', (error) => {
  console.error('🔴 General Error:', error.message);
});

// ================== ЗАПУСК СЕРВЕРА ==================

app.listen(PORT, () => {
  console.log(`🌐 HTTP сервер запущен на порту ${PORT}`);
  console.log(`🤖 Бот ожидает сообщений...`);
  console.log(`📊 API доступно по http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Напишите /start вашему боту в Telegram`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Остановка сервера...');
  bot.stopPolling();
  process.exit(0);
});