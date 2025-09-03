const BOT_TOKEN = process.env.REACT_APP_TG_TOKEN;

export const telegramService = {
  sendMessage: async (chatId, text) => {
    if (!BOT_TOKEN) {
      console.warn('BOT_TOKEN not configured');
      return null;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  },

  // Дополнительные методы API Telegram
  sendPhoto: async (chatId, photoUrl, caption = '') => {
    // реализация отправки фото
  }
};