(function() {
    // Ждем загрузки Telegram WebApp API
    if (typeof window.Telegram !== 'undefined') {
        return;
    }
    
    // Создаем скрипт для загрузки Telegram WebApp API
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    document.head.appendChild(script);
})();